#!/usr/bin/env python3
"""
AD Sync Agent for ServiceDesk Platform

This agent synchronizes users from Active Directory (AD) to the ServiceDesk platform.
It runs on a server with access to the local AD and periodically syncs user data.

Requirements:
    pip install ldap3 requests python-dotenv

Configuration:
    Create a .env file with:
        AD_HOST=ldap://your-ad-server:389
        AD_USERNAME=service_account@domain.local
        AD_PASSWORD=your_password
        AD_BASE_DN=DC=domain,DC=local
        AD_USER_SEARCH_BASE=CN=Users,DC=domain,DC=local
        AD_USER_SEARCH_FILTER=(objectClass=user)
        PLATFORM_URL=https://your-platform.com
        TENANT_ID=your-tenant-id
        API_KEY=your-api-key
        SYNC_INTERVAL=3600
"""

import os
import sys
import time
import json
import logging
import requests
from datetime import datetime
from typing import List, Dict, Optional
from ldap3 import Server, Connection, ALL, SUBTREE, Tls
import ssl
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('ad_sync.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)


class ADSynchronizer:
    """Active Directory Synchronizer"""
    
    def __init__(self):
        # AD Configuration
        self.ad_host = os.getenv('AD_HOST', 'ldap://localhost:389')
        self.ad_username = os.getenv('AD_USERNAME')
        self.ad_password = os.getenv('AD_PASSWORD')
        self.ad_base_dn = os.getenv('AD_BASE_DN')
        self.ad_user_search_base = os.getenv('AD_USER_SEARCH_BASE')
        self.ad_user_search_filter = os.getenv('AD_USER_SEARCH_FILTER', '(objectClass=user)')
        self.ad_use_ssl = os.getenv('AD_USE_SSL', 'false').lower() == 'true'
        
        # Platform Configuration
        self.platform_url = os.getenv('PLATFORM_URL', 'http://localhost:3000')
        self.tenant_id = os.getenv('TENANT_ID')
        self.api_key = os.getenv('API_KEY')
        self.sync_interval = int(os.getenv('SYNC_INTERVAL', '3600'))
        
        # Validate configuration
        self._validate_config()
        
        # LDAP Connection
        self.ldap_conn = None
        
    def _validate_config(self):
        """Validate configuration"""
        required = [
            'AD_HOST', 'AD_USERNAME', 'AD_PASSWORD', 'AD_BASE_DN',
            'PLATFORM_URL', 'TENANT_ID', 'API_KEY'
        ]
        missing = [var for var in required if not os.getenv(var)]
        if missing:
            raise ValueError(f"Missing required environment variables: {', '.join(missing)}")
        
        logger.info("Configuration validated successfully")
    
    def connect_ldap(self) -> bool:
        """Connect to Active Directory"""
        try:
            # Parse LDAP URL
            if self.ad_host.startswith('ldap://'):
                host = self.ad_host.replace('ldap://', '').split(':')[0]
                port = int(self.ad_host.split(':')[-1]) if ':' in self.ad_host else 389
                use_ssl = False
            elif self.ad_host.startswith('ldaps://'):
                host = self.ad_host.replace('ldaps://', '').split(':')[0]
                port = int(self.ad_host.split(':')[-1]) if ':' in self.ad_host else 636
                use_ssl = True
            else:
                # Assume format: host:port
                parts = self.ad_host.split(':')
                host = parts[0]
                port = int(parts[1]) if len(parts) > 1 else (636 if self.ad_use_ssl else 389)
                use_ssl = self.ad_use_ssl
            
            # Create server
            server = Server(
                host,
                port=port,
                use_ssl=use_ssl,
                get_info=ALL
            )
            
            # Create connection
            self.ldap_conn = Connection(
                server,
                user=self.ad_username,
                password=self.ad_password,
                auto_bind=True,
                authentication='SIMPLE'
            )
            
            logger.info(f"Successfully connected to AD at {host}:{port}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to connect to AD: {str(e)}")
            return False
    
    def disconnect_ldap(self):
        """Disconnect from Active Directory"""
        if self.ldap_conn:
            try:
                self.ldap_conn.unbind()
                logger.info("Disconnected from AD")
            except:
                pass
            self.ldap_conn = None
    
    def fetch_users_from_ad(self) -> List[Dict]:
        """Fetch users from Active Directory"""
        if not self.ldap_conn:
            logger.error("Not connected to AD")
            return []
        
        users = []
        try:
            # Search for users
            self.ldap_conn.search(
                search_base=self.ad_user_search_base or self.ad_base_dn,
                search_filter=self.ad_user_search_filter,
                search_scope=SUBTREE,
                attributes=['sAMAccountName', 'mail', 'userPrincipalName', 'displayName', 
                           'givenName', 'sn', 'memberOf', 'userAccountControl', 
                           'distinguishedName', 'department', 'title']
            )
            
            for entry in self.ldap_conn.entries:
                try:
                    # Extract user data
                    user_account_control = int(entry.userAccountControl.raw_values[0]) if hasattr(entry, 'userAccountControl') else 0
                    # Check if account is disabled (bit 2)
                    is_disabled = (user_account_control & 0x0002) != 0
                    
                    # Get email (prefer mail, fallback to userPrincipalName)
                    email = None
                    if hasattr(entry, 'mail') and entry.mail:
                        email = str(entry.mail)
                    elif hasattr(entry, 'userPrincipalName') and entry.userPrincipalName:
                        email = str(entry.userPrincipalName)
                    
                    # Skip if no email
                    if not email:
                        continue
                    
                    # Get name
                    name = None
                    if hasattr(entry, 'displayName') and entry.displayName:
                        name = str(entry.displayName)
                    elif hasattr(entry, 'givenName') and hasattr(entry, 'sn'):
                        given_name = str(entry.givenName) if hasattr(entry, 'givenName') else ''
                        sn = str(entry.sn) if hasattr(entry, 'sn') else ''
                        name = f"{given_name} {sn}".strip()
                    
                    if not name:
                        name = email.split('@')[0]
                    
                    # Get groups
                    groups = []
                    if hasattr(entry, 'memberOf'):
                        for group_dn in entry.memberOf:
                            # Extract group name from DN (CN=GroupName,OU=...)
                            group_name = str(group_dn).split(',')[0].replace('CN=', '')
                            groups.append(group_name)
                    
                    # Get attributes
                    attributes = {}
                    if hasattr(entry, 'department') and entry.department:
                        attributes['department'] = str(entry.department)
                    if hasattr(entry, 'title') and entry.title:
                        attributes['title'] = str(entry.title)
                    
                    user_data = {
                        'email': email,
                        'name': name,
                        'active': not is_disabled,
                        'groups': groups,
                        'attributes': attributes
                    }
                    
                    users.append(user_data)
                    
                except Exception as e:
                    logger.warning(f"Error processing user entry: {str(e)}")
                    continue
            
            logger.info(f"Fetched {len(users)} users from AD")
            return users
            
        except Exception as e:
            logger.error(f"Error fetching users from AD: {str(e)}")
            return []
    
    def sync_users_to_platform(self, users: List[Dict]) -> bool:
        """Sync users to the platform"""
        if not users:
            logger.warning("No users to sync")
            return False
        
        try:
            # Prepare request
            url = f"{self.platform_url.rstrip('/')}/api/tenants/{self.tenant_id}/sync/users"
            headers = {
                'Content-Type': 'application/json',
                'X-AD-Sync-Api-Key': self.api_key
            }
            payload = {
                'users': users
            }
            
            # Send request
            logger.info(f"Sending {len(users)} users to platform...")
            response = requests.post(url, json=payload, headers=headers, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                logger.info(f"Sync successful: {result.get('message', 'OK')}")
                logger.info(f"Results: {result.get('results', {})}")
                return True
            else:
                error_data = response.json() if response.content else {}
                logger.error(f"Sync failed: {response.status_code} - {error_data.get('error', 'Unknown error')}")
                return False
                
        except requests.exceptions.RequestException as e:
            logger.error(f"Network error during sync: {str(e)}")
            return False
        except Exception as e:
            logger.error(f"Error syncing users to platform: {str(e)}")
            return False
    
    def test_connection(self) -> bool:
        """Test connection to platform"""
        try:
            url = f"{self.platform_url.rstrip('/')}/api/tenants/{self.tenant_id}/sync/users"
            headers = {
                'X-AD-Sync-Api-Key': self.api_key
            }
            
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                logger.info(f"✅ Platform connection successful!")
                logger.info(f"Tenant: {result.get('tenant', {}).get('name', 'Unknown')}")
                logger.info(f"User count: {result.get('userCount', 0)}")
                return True
            else:
                error_data = response.json() if response.content else {}
                logger.error(f"❌ Platform connection failed: {error_data.get('error', 'Unknown error')}")
                return False
                
        except Exception as e:
            logger.error(f"❌ Error testing platform connection: {str(e)}")
            return False
    
    def sync(self):
        """Perform synchronization"""
        logger.info("=" * 60)
        logger.info(f"Starting AD sync at {datetime.now()}")
        logger.info("=" * 60)
        
        # Connect to AD
        if not self.connect_ldap():
            logger.error("Failed to connect to AD. Aborting sync.")
            return
        
        try:
            # Fetch users from AD
            users = self.fetch_users_from_ad()
            
            if users:
                # Sync to platform
                success = self.sync_users_to_platform(users)
                
                if success:
                    logger.info("✅ Sync completed successfully")
                else:
                    logger.error("❌ Sync failed")
            else:
                logger.warning("No users found in AD")
                
        finally:
            # Disconnect from AD
            self.disconnect_ldap()
        
        logger.info("=" * 60)
    
    def run(self):
        """Run synchronizer in loop mode"""
        logger.info("Starting AD Sync Agent...")
        logger.info(f"Platform: {self.platform_url}")
        logger.info(f"Tenant ID: {self.tenant_id}")
        logger.info(f"Sync interval: {self.sync_interval} seconds")
        
        # Test platform connection first
        if not self.test_connection():
            logger.error("Platform connection test failed. Please check your configuration.")
            sys.exit(1)
        
        # Perform initial sync
        self.sync()
        
        # Run in loop
        logger.info(f"Running in loop mode (sync every {self.sync_interval} seconds)...")
        try:
            while True:
                time.sleep(self.sync_interval)
                self.sync()
        except KeyboardInterrupt:
            logger.info("Sync agent stopped by user")
        except Exception as e:
            logger.error(f"Fatal error: {str(e)}")
            sys.exit(1)


def main():
    """Main entry point"""
    try:
        synchronizer = ADSynchronizer()
        synchronizer.run()
    except ValueError as e:
        logger.error(f"Configuration error: {str(e)}")
        sys.exit(1)
    except Exception as e:
        logger.error(f"Fatal error: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    main()

