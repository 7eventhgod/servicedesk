package main

import (
	"bytes"
	"crypto/tls"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/go-ldap/ldap/v3"
	"github.com/joho/godotenv"
)

// User represents a user from Active Directory
type User struct {
	Email     string            `json:"email"`
	Name      string            `json:"name"`
	Active    bool              `json:"active"`
	Groups    []string          `json:"groups,omitempty"`
	Attributes map[string]interface{} `json:"attributes,omitempty"`
}

// SyncRequest represents the sync request payload
type SyncRequest struct {
	Users []User `json:"users"`
}

// SyncResponse represents the sync response
type SyncResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Results struct {
		Created int `json:"created"`
		Updated int `json:"updated"`
		Errors  []struct {
			Email string `json:"email"`
			Error string `json:"error"`
		} `json:"errors"`
	} `json:"results"`
}

// Config holds configuration
type Config struct {
	ADHost           string
	ADUsername       string
	ADPassword       string
	ADBaseDN         string
	ADUserSearchBase string
	ADUserSearchFilter string
	ADUseSSL         bool
	
	PlatformURL string
	TenantID    string
	APIKey      string
	
	SyncInterval int
}

// ADSynchronizer handles AD synchronization
type ADSynchronizer struct {
	config *Config
	conn   *ldap.Conn
}

func NewADSynchronizer() (*ADSynchronizer, error) {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found, using environment variables")
	}

	config := &Config{
		ADHost:            getEnv("AD_HOST", "ldap://localhost:389"),
		ADUsername:        getEnv("AD_USERNAME", ""),
		ADPassword:        getEnv("AD_PASSWORD", ""),
		ADBaseDN:          getEnv("AD_BASE_DN", ""),
		ADUserSearchBase:  getEnv("AD_USER_SEARCH_BASE", ""),
		ADUserSearchFilter: getEnv("AD_USER_SEARCH_FILTER", "(objectClass=user)"),
		ADUseSSL:          getEnvBool("AD_USE_SSL", false),
		
		PlatformURL: getEnv("PLATFORM_URL", "http://localhost:3000"),
		TenantID:    getEnv("TENANT_ID", ""),
		APIKey:      getEnv("API_KEY", ""),
		
		SyncInterval: getEnvInt("SYNC_INTERVAL", 3600),
	}

	// Validate configuration
	if err := config.Validate(); err != nil {
		return nil, fmt.Errorf("configuration error: %w", err)
	}

	return &ADSynchronizer{
		config: config,
	}, nil
}

func (c *Config) Validate() error {
	required := map[string]string{
		"AD_HOST":         c.ADHost,
		"AD_USERNAME":     c.ADUsername,
		"AD_PASSWORD":     c.ADPassword,
		"AD_BASE_DN":      c.ADBaseDN,
		"PLATFORM_URL":    c.PlatformURL,
		"TENANT_ID":       c.TenantID,
		"API_KEY":         c.APIKey,
	}

	for name, value := range required {
		if value == "" {
			return fmt.Errorf("%s is required", name)
		}
	}

	return nil
}

func (s *ADSynchronizer) ConnectLDAP() error {
	// Parse LDAP URL
	var host string
	var port int
	var useSSL bool

	if strings.HasPrefix(s.config.ADHost, "ldap://") {
		host = strings.TrimPrefix(s.config.ADHost, "ldap://")
		parts := strings.Split(host, ":")
		if len(parts) > 1 {
			host = parts[0]
			port, _ = strconv.Atoi(parts[1])
		} else {
			port = 389
		}
		useSSL = false
	} else if strings.HasPrefix(s.config.ADHost, "ldaps://") {
		host = strings.TrimPrefix(s.config.ADHost, "ldaps://")
		parts := strings.Split(host, ":")
		if len(parts) > 1 {
			host = parts[0]
			port, _ = strconv.Atoi(parts[1])
		} else {
			port = 636
		}
		useSSL = true
	} else {
		parts := strings.Split(s.config.ADHost, ":")
		host = parts[0]
		if len(parts) > 1 {
			port, _ = strconv.Atoi(parts[1])
		} else {
			port = 389
		}
		useSSL = s.config.ADUseSSL
	}

	// Create LDAP connection
	l, err := ldap.DialURL(fmt.Sprintf("%s://%s:%d", map[bool]string{true: "ldaps", false: "ldap"}[useSSL], host, port))
	if err != nil {
		return fmt.Errorf("failed to connect to LDAP: %w", err)
	}

	if useSSL {
		err = l.StartTLS(&tls.Config{InsecureSkipVerify: true})
		if err != nil {
			return fmt.Errorf("failed to start TLS: %w", err)
		}
	}

	// Bind with credentials
	err = l.Bind(s.config.ADUsername, s.config.ADPassword)
	if err != nil {
		l.Close()
		return fmt.Errorf("failed to bind to LDAP: %w", err)
	}

	s.conn = l
	log.Printf("✅ Successfully connected to AD at %s:%d\n", host, port)
	return nil
}

func (s *ADSynchronizer) DisconnectLDAP() {
	if s.conn != nil {
		s.conn.Close()
		log.Println("Disconnected from AD")
		s.conn = nil
	}
}

func (s *ADSynchronizer) FetchUsers() ([]User, error) {
	if s.conn == nil {
		return nil, fmt.Errorf("not connected to AD")
	}

	searchBase := s.config.ADUserSearchBase
	if searchBase == "" {
		searchBase = s.config.ADBaseDN
	}

	// Search for users
	searchRequest := ldap.NewSearchRequest(
		searchBase,
		ldap.ScopeWholeSubtree,
		ldap.NeverDerefAliases,
		0,
		0,
		false,
		s.config.ADUserSearchFilter,
		[]string{"sAMAccountName", "mail", "userPrincipalName", "displayName", 
			"givenName", "sn", "memberOf", "userAccountControl", 
			"distinguishedName", "department", "title"},
		nil,
	)

	sr, err := s.conn.Search(searchRequest)
	if err != nil {
		return nil, fmt.Errorf("search failed: %w", err)
	}

	users := []User{}
	for _, entry := range sr.Entries {
		// Get email (prefer mail, fallback to userPrincipalName)
		var email string
		if mail := entry.GetAttributeValue("mail"); mail != "" {
			email = mail
		} else if upn := entry.GetAttributeValue("userPrincipalName"); upn != "" {
			email = upn
		}
		
		if email == "" {
			continue // Skip users without email
		}

		// Get name
		name := entry.GetAttributeValue("displayName")
		if name == "" {
			givenName := entry.GetAttributeValue("givenName")
			sn := entry.GetAttributeValue("sn")
			name = strings.TrimSpace(givenName + " " + sn)
		}
		if name == "" {
			name = strings.Split(email, "@")[0]
		}

		// Check if account is disabled
		userAccountControl := entry.GetAttributeValue("userAccountControl")
		isDisabled := false
		if uac, err := strconv.Atoi(userAccountControl); err == nil {
			// Bit 2 (0x0002) = ACCOUNTDISABLE
			isDisabled = (uac & 0x0002) != 0
		}

		// Get groups
		groups := []string{}
		if memberOf := entry.GetAttributeValues("memberOf"); len(memberOf) > 0 {
			for _, groupDN := range memberOf {
				// Extract group name from DN (CN=GroupName,OU=...)
				parts := strings.Split(groupDN, ",")
				if len(parts) > 0 {
					groupName := strings.TrimPrefix(parts[0], "CN=")
					groups = append(groups, groupName)
				}
			}
		}

		// Get attributes
		attributes := make(map[string]interface{})
		if dept := entry.GetAttributeValue("department"); dept != "" {
			attributes["department"] = dept
		}
		if title := entry.GetAttributeValue("title"); title != "" {
			attributes["title"] = title
		}

		user := User{
			Email:      email,
			Name:       name,
			Active:     !isDisabled,
			Groups:     groups,
			Attributes: attributes,
		}

		users = append(users, user)
	}

	log.Printf("📋 Fetched %d users from AD\n", len(users))
	return users, nil
}

func (s *ADSynchronizer) SyncUsers(users []User) error {
	if len(users) == 0 {
		log.Println("⚠️  No users to sync")
		return nil
	}

	url := fmt.Sprintf("%s/api/tenants/%s/sync/users", 
		strings.TrimSuffix(s.config.PlatformURL, "/"), 
		s.config.TenantID)

	payload := SyncRequest{Users: users}
	jsonData, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("failed to marshal JSON: %w", err)
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-AD-Sync-Api-Key", s.config.APIKey)

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("failed to read response: %w", err)
	}

	if resp.StatusCode != 200 {
		var errorResp map[string]interface{}
		if err := json.Unmarshal(body, &errorResp); err == nil {
			return fmt.Errorf("sync failed: %v", errorResp["error"])
		}
		return fmt.Errorf("sync failed with status %d: %s", resp.StatusCode, string(body))
	}

	var syncResp SyncResponse
	if err := json.Unmarshal(body, &syncResp); err != nil {
		return fmt.Errorf("failed to parse response: %w", err)
	}

	log.Printf("✅ Sync successful: %s\n", syncResp.Message)
	if syncResp.Results.Created > 0 {
		log.Printf("   Created: %d users\n", syncResp.Results.Created)
	}
	if syncResp.Results.Updated > 0 {
		log.Printf("   Updated: %d users\n", syncResp.Results.Updated)
	}
	if len(syncResp.Results.Errors) > 0 {
		log.Printf("   Errors: %d\n", len(syncResp.Results.Errors))
	}

	return nil
}

func (s *ADSynchronizer) TestConnection() error {
	url := fmt.Sprintf("%s/api/tenants/%s/sync/users", 
		strings.TrimSuffix(s.config.PlatformURL, "/"), 
		s.config.TenantID)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("X-AD-Sync-Api-Key", s.config.APIKey)

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("connection test failed: %s", string(body))
	}

	var result map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err == nil {
		log.Printf("✅ Platform connection successful!\n")
		if tenant, ok := result["tenant"].(map[string]interface{}); ok {
			log.Printf("   Tenant: %v\n", tenant["name"])
		}
		if userCount, ok := result["userCount"].(float64); ok {
			log.Printf("   User count: %.0f\n", userCount)
		}
	}

	return nil
}

func (s *ADSynchronizer) Sync() {
	log.Println("=" + strings.Repeat("=", 59))
	log.Printf("Starting AD sync at %s\n", time.Now().Format("2006-01-02 15:04:05"))
	log.Println("=" + strings.Repeat("=", 59))

	// Connect to AD
	if err := s.ConnectLDAP(); err != nil {
		log.Printf("❌ Failed to connect to AD: %v\n", err)
		return
	}

	defer s.DisconnectLDAP()

	// Fetch users
	users, err := s.FetchUsers()
	if err != nil {
		log.Printf("❌ Failed to fetch users: %v\n", err)
		return
	}

	if len(users) == 0 {
		log.Println("⚠️  No users found in AD")
		return
	}

	// Sync to platform
	if err := s.SyncUsers(users); err != nil {
		log.Printf("❌ Sync failed: %v\n", err)
		return
	}

	log.Println("=" + strings.Repeat("=", 59))
}

func (s *ADSynchronizer) Run() {
	log.Println("🚀 Starting AD Sync Agent...")
	log.Printf("Platform: %s\n", s.config.PlatformURL)
	log.Printf("Tenant ID: %s\n", s.config.TenantID)
	log.Printf("Sync interval: %d seconds\n", s.config.SyncInterval)

	// Test platform connection first
	if err := s.TestConnection(); err != nil {
		log.Printf("❌ Platform connection test failed: %v\n", err)
		log.Println("Please check your configuration.")
		os.Exit(1)
	}

	// Perform initial sync
	s.Sync()

	// Run in loop
	log.Printf("Running in loop mode (sync every %d seconds)...\n", s.config.SyncInterval)
	for {
		time.Sleep(time.Duration(s.config.SyncInterval) * time.Second)
		s.Sync()
	}
}

func main() {
	synchronizer, err := NewADSynchronizer()
	if err != nil {
		log.Fatalf("❌ Configuration error: %v\n", err)
	}

	// Handle SIGINT (Ctrl+C)
	go func() {
		synchronizer.Run()
	}()

	// Wait for interrupt
	select {}
}

// Helper functions
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvBool(key string, defaultValue bool) bool {
	if value := os.Getenv(key); value != "" {
		if b, err := strconv.ParseBool(value); err == nil {
			return b
		}
	}
	return defaultValue
}

func getEnvInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if i, err := strconv.Atoi(value); err == nil {
			return i
		}
	}
	return defaultValue
}

