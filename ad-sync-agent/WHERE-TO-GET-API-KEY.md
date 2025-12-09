# How to Get Your ServiceDesk API Credentials

## What You Need

To connect the AD Agent, you need 3 things from your ServiceDesk web interface:

### 1. **Platform URL**
- This is your ServiceDesk website address
- Example: `https://servicedesk.yourcompany.com` or `http://localhost:3000`

### 2. **Tenant ID**
This is your organization ID.

**How to find it:**
1. Log in to ServiceDesk as **Organization Admin**
2. Go to **Settings** → **Organization Settings**
3. Look for "Organization ID" or "Tenant ID"
4. Copy the ID (looks like: `cm123abc456def789`)

### 3. **API Key**
This allows the agent to securely sync users.

**How to get it:**

#### Option A: Generate from AD Sync Settings Page
1. Go to **Settings** → **AD Sync** in ServiceDesk
2. Click **"Generate API Key"** or **"Create Connector"**
3. Copy the API key shown (it won't be shown again!)

#### Option B: Use the Web Interface to Generate
Currently, you'll need to create an LDAP config first to get the API endpoint working.

For now, use this temporary API key format:
- Use your user's auth token from browser DevTools
- Or create a service account in ServiceDesk

---

## Example Configuration

```env
# Active Directory
AD_HOST=ldap://dc01.company.local:389
AD_USERNAME=svc_servicedesk@company.local
AD_PASSWORD=YourSecurePassword123
AD_BASE_DN=DC=company,DC=local
AD_USER_SEARCH_BASE=CN=Users,DC=company,DC=local
AD_USER_SEARCH_FILTER=(objectClass=user)
AD_USE_SSL=false

# ServiceDesk Platform
PLATFORM_URL=http://localhost:3000
TENANT_ID=cm3sa8o4v000008l80k9wgfyq
API_KEY=your-api-key-here

# Sync every hour (3600 seconds)
SYNC_INTERVAL=3600
```

---

## Testing the Connection

Once configured, the agent will:

1. ✅ Connect to your Active Directory
2. ✅ Fetch all users
3. ✅ Send them to ServiceDesk API
4. ✅ Repeat every hour (or your configured interval)

You'll see logs showing:
```
[INFO] Starting AD Sync Agent...
[INFO] Connected to AD: dc01.company.local
[INFO] Found 150 users
[INFO] Syncing to platform: http://localhost:3000
[SUCCESS] Synced 150 users (145 created, 5 updated)
[INFO] Next sync in 3600 seconds
```

---

## Troubleshooting

### "Cannot connect to AD"
- Check `AD_HOST` - try IP address if hostname doesn't work
- Check firewall allows port 389 (LDAP) or 636 (LDAPS)
- Verify service account credentials

### "API call failed"
- Check `PLATFORM_URL` is correct and reachable
- Verify `TENANT_ID` matches your organization
- Ensure `API_KEY` is valid

### "No users found"
- Check `AD_BASE_DN` is correct
- Try simpler filter: `(objectClass=user)`
- Check service account has read permissions in AD

---

## Need Help?

Check the ServiceDesk documentation or contact support with your logs.
