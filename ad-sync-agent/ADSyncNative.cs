using System;
using System.Collections.Generic;
using System.DirectoryServices;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace ADSyncAgent
{
    /// <summary>
    /// Native C# Active Directory Sync Agent
    /// Works with Next.js/TypeScript ServiceDesk backend via HTTP/JSON
    /// </summary>
    public class ADSyncAgent
    {
        private readonly string platformUrl;
        private readonly string tenantId;
        private readonly string apiKey;
        private readonly string ldapPath;
        private readonly string username;
        private readonly string password;
        private readonly HttpClient httpClient;

        public ADSyncAgent(string platformUrl, string tenantId, string apiKey,
                          string ldapPath, string username, string password)
        {
            this.platformUrl = platformUrl.TrimEnd('/');
            this.tenantId = tenantId;
            this.apiKey = apiKey;
            this.ldapPath = ldapPath;
            this.username = username;
            this.password = password;
            this.httpClient = new HttpClient();
        }

        /// <summary>
        /// Fetch users from Active Directory
        /// </summary>
        public List<ADUser> FetchUsersFromAD()
        {
            var users = new List<ADUser>();

            try
            {
                Console.WriteLine($"[INFO] Connecting to AD: {ldapPath}");

                using (DirectoryEntry entry = new DirectoryEntry(ldapPath, username, password))
                using (DirectorySearcher searcher = new DirectorySearcher(entry))
                {
                    // Search for all active users
                    searcher.Filter = "(&(objectClass=user)(objectCategory=person)(!(userAccountControl:1.2.840.113556.1.4.803:=2)))";
                    searcher.PropertiesToLoad.AddRange(new[] {
                        "sAMAccountName", "mail", "userPrincipalName",
                        "displayName", "givenName", "sn", "memberOf"
                    });
                    searcher.PageSize = 1000; // Enable pagination

                    Console.WriteLine("[INFO] Searching for users...");
                    SearchResultCollection results = searcher.FindAll();

                    foreach (SearchResult result in results)
                    {
                        try
                        {
                            var properties = result.Properties;

                            // Get email (prefer mail, fallback to UPN)
                            string email = GetProperty(properties, "mail");
                            if (string.IsNullOrEmpty(email))
                            {
                                email = GetProperty(properties, "userPrincipalName");
                            }

                            if (string.IsNullOrEmpty(email))
                            {
                                continue; // Skip users without email
                            }

                            // Get display name
                            string displayName = GetProperty(properties, "displayName");
                            if (string.IsNullOrEmpty(displayName))
                            {
                                string givenName = GetProperty(properties, "givenName");
                                string sn = GetProperty(properties, "sn");
                                displayName = $"{givenName} {sn}".Trim();
                            }

                            if (string.IsNullOrEmpty(displayName))
                            {
                                displayName = email.Split('@')[0];
                            }

                            // Get groups
                            List<string> groups = new List<string>();
                            if (properties.Contains("memberOf"))
                            {
                                foreach (object groupDn in properties["memberOf"])
                                {
                                    string groupName = ExtractCN(groupDn.ToString());
                                    if (!string.IsNullOrEmpty(groupName))
                                    {
                                        groups.Add(groupName);
                                    }
                                }
                            }

                            var user = new ADUser
                            {
                                Email = email,
                                Name = displayName,
                                Active = true,
                                Groups = groups,
                                Attributes = new Dictionary<string, object>()
                            };

                            users.Add(user);
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"[WARN] Error processing user: {ex.Message}");
                        }
                    }

                    Console.WriteLine($"[INFO] Fetched {users.Count} users from AD");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] Failed to fetch users from AD: {ex.Message}");
                throw;
            }

            return users;
        }

        /// <summary>
        /// Sync users to ServiceDesk platform via HTTP API
        /// </summary>
        public async Task<SyncResult> SyncUsersToPlat form(List<ADUser> users)
        {
            try
            {
                string url = $"{platformUrl}/api/tenants/{tenantId}/sync/users";
                Console.WriteLine($"[INFO] Syncing {users.Count} users to {url}");

                // Prepare request
                var payload = new { users = users };
                string jsonPayload = JsonSerializer.Serialize(payload, new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                });

                var request = new HttpRequestMessage(HttpMethod.Post, url);
                request.Headers.Add("X-AD-Sync-Api-Key", apiKey);
                request.Content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

                // Send request
                HttpResponseMessage response = await httpClient.SendAsync(request);
                string responseBody = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    var result = JsonSerializer.Deserialize<SyncResult>(responseBody, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

                    Console.WriteLine($"[SUCCESS] Sync completed: {result.Results.Created} created, {result.Results.Updated} updated");
                    return result;
                }
                else
                {
                    Console.WriteLine($"[ERROR] Sync failed: {(int)response.StatusCode} - {responseBody}");
                    throw new Exception($"API returned {(int)response.StatusCode}: {responseBody}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] Sync failed: {ex.Message}");
                throw;
            }
        }

        /// <summary>
        /// Perform full sync operation
        /// </summary>
        public async Task PerformSync()
        {
            Console.WriteLine("=======================================================");
            Console.WriteLine($"[INFO] Starting AD Sync at {DateTime.Now}");
            Console.WriteLine("=======================================================");

            try
            {
                // Fetch users from AD
                List<ADUser> users = FetchUsersFromAD();

                if (users.Count == 0)
                {
                    Console.WriteLine("[WARN] No users found in AD");
                    return;
                }

                // Sync to platform
                SyncResult result = await SyncUsersToPlat form(users);

                Console.WriteLine("=======================================================");
                Console.WriteLine($"[INFO] ✅ Sync completed successfully");
                Console.WriteLine("=======================================================");
            }
            catch (Exception ex)
            {
                Console.WriteLine("=======================================================");
                Console.WriteLine($"[ERROR] ❌ Sync failed: {ex.Message}");
                Console.WriteLine("=======================================================");
                throw;
            }
        }

        // Helper methods
        private string GetProperty(ResultPropertyCollection properties, string propertyName)
        {
            if (properties.Contains(propertyName) && properties[propertyName].Count > 0)
            {
                return properties[propertyName][0]?.ToString();
            }
            return null;
        }

        private string ExtractCN(string dn)
        {
            // Extract CN from DN: "CN=GroupName,OU=..." -> "GroupName"
            if (dn.StartsWith("CN=", StringComparison.OrdinalIgnoreCase))
            {
                int endIndex = dn.IndexOf(',');
                if (endIndex > 3)
                {
                    return dn.Substring(3, endIndex - 3);
                }
            }
            return dn;
        }
    }

    // Data models matching the API contract
    public class ADUser
    {
        public string Email { get; set; }
        public string Name { get; set; }
        public bool Active { get; set; }
        public List<string> Groups { get; set; }
        public Dictionary<string, object> Attributes { get; set; }
    }

    public class SyncResult
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public ResultDetails Results { get; set; }
    }

    public class ResultDetails
    {
        public int Created { get; set; }
        public int Updated { get; set; }
        public List<ErrorDetail> Errors { get; set; }
    }

    public class ErrorDetail
    {
        public string Email { get; set; }
        public string Error { get; set; }
    }

    // Example usage
    class Program
    {
        static async Task Main(string[] args)
        {
            var agent = new ADSyncAgent(
                platformUrl: "http://localhost:3000",
                tenantId: "your-tenant-id",
                apiKey: "sdk_your-api-key",
                ldapPath: "LDAP://DC=company,DC=local",
                username: "servicedesk@company.local",
                password: "your-password"
            );

            await agent.PerformSync();
        }
    }
}
