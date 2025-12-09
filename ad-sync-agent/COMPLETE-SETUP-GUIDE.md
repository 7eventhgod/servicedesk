# Complete AD Sync Setup Guide

## 🚀 Quick Start (5 Minutes)

### Prerequisites Checklist
- [ ] Python 3.8+ installed (`python --version`)
- [ ] Access to your Active Directory server
- [ ] ServiceDesk admin account

---

## Step 1: Enable AD Sync in ServiceDesk (Web Interface)

1. **Log in to ServiceDesk** as Organization Admin
   - Go to: `http://your-servicedesk-url`

2. **Navigate to AD Sync Settings**
   - Click: **Settings** → **AD Sync**
   - Or go to: `/dashboard/settings/ad-sync`

3. **Generate API Key**
   - Click: **"Generate API Key"**
   - ⚠️ **COPY IT IMMEDIATELY!** You won't see it again
   - Save it somewhere safe (Notepad, password manager, etc.)

4. **Note Your Tenant ID**
   - It's shown on the same page
   - Looks like: `cm3sa8o4v000008l80k9wgfyq`

---

## Step 2: Run the Setup Wizard (This Computer)

### Option A: Easy Setup Wizard (Recommended)

1. **Open the `ad-sync-agent` folder**

2. **Double-click: `EASY-SETUP.bat`**

3. **Follow the wizard:**
   - **Step 1/3:** Enter AD details
     - Server: `dc01.company.local` (or IP like `192.168.1.10`)
     - Port: `389` (or `636` for SSL)
     - Domain: `company.local`
     - Username: `svc_servicedesk@company.local`
     - Password: (your service account password)
   
   - **Step 2/3:** Enter ServiceDesk details
     - URL: `http://localhost:3000` (or your cloud URL)
     - Tenant ID: (from Step 1)
     - API Key: (from Step 1)
   
   - **Step 3/3:** Review and confirm

4. **Start the agent** when prompted

### Option B: Manual Setup

1. **Copy configuration file:**
   ```cmd
   copy .env.example .env
   ```

2. **Edit `.env` file** (use Notepad):
   ```env
   AD_HOST=ldap://dc01.company.local:389
   AD_USERNAME=svc_servicedesk@company.local
   AD_PASSWORD=YourPassword123
   AD_BASE_DN=DC=company,DC=local
   AD_USER_SEARCH_BASE=CN=Users,DC=company,DC=local
   AD_USER_SEARCH_FILTER=(objectClass=user)
   AD_USE_SSL=false

   PLATFORM_URL=http://localhost:3000
   TENANT_ID=cm3sa8o4v000008l80k9wgfyq
   API_KEY=sdk_abc123...

   SYNC_INTERVAL=3600
   ```

3. **Run the agent:**
   ```cmd
   python ad_sync_agent.py
   ```

---

## Step 3: Verify It Works

### Check the Agent Logs

You should see:
```
[INFO] Starting AD Sync Agent...
[INFO] Platform: http://localhost:3000
[INFO] Tenant ID: cm3sa8o4v000008l80k9wgfyq
[INFO] Successfully connected to AD at dc01.company.local:389
[INFO] Fetched 150 users from AD
[INFO] Sending 150 users to platform...
[INFO] Sync successful: Synced 150 users: 145 created, 5 updated
[INFO] ✅ Sync completed successfully
[INFO] Next sync in 3600 seconds (1 hour)
```

### Check ServiceDesk

1. Go to: **Users** page in ServiceDesk
2. You should see all your AD users listed!
3. Users can now log in with: `domain\username` or `username@domain.com`

---

## 🎯 Success! What Happens Now?

The agent will:
- ✅ Run continuously in the background
- ✅ Sync users every hour (or your configured interval)
- ✅ Create new users automatically
- ✅ Update existing users
- ✅ Deactivate users removed from AD

---

## Running as a Windows Service (Optional)

### Option 1: Task Scheduler

1. Open **Task Scheduler**

2. Create Task:
   - Name: `ServiceDesk AD Sync`
   - Run whether user is logged on or not: ☑
   - Run with highest privileges: ☑

3. Trigger:
   - At startup
   - Repeat every: 1 hour

4. Action:
   - Program: `C:\Python313\python.exe`
   - Arguments: `ad_sync_agent.py`
   - Start in: `C:\path\to\ad-sync-agent`

### Option 2: NSSM (Windows Service)

```cmd
# Download NSSM from nssm.cc
nssm install "ServiceDesk AD Sync" "C:\Python313\python.exe" "C:\path\to\ad_sync_agent.py"
nssm set "ServiceDesk AD Sync" AppDirectory "C:\path\to\ad-sync-agent"
nssm start "ServiceDesk AD Sync"
```

---

## Troubleshooting

### ❌ "Cannot connect to AD"

**Problem:** Can't reach AD server

**Solutions:**
- ✅ Check server address is correct
- ✅ Ping the server: `ping dc01.company.local`
- ✅ Check firewall allows port 389 (or 636)
- ✅ Try using IP address instead of hostname

### ❌ "LDAP bind failed: Invalid Credentials"

**Problem:** Username or password wrong

**Solutions:**
- ✅ Verify username format: `user@domain.com` NOT `domain\user`
- ✅ Check password has no typos
- ✅ Test login on another computer
- ✅ Check account is not locked

### ❌ "Invalid API key"

**Problem:** API key not accepted

**Solutions:**
- ✅ Regenerate API key in ServiceDesk settings
- ✅ Check no extra spaces in `.env` file
- ✅ Verify AD Sync is enabled in ServiceDesk
- ✅ Check Tenant ID matches

### ❌ "No users found"

**Problem:** Can't find users in AD

**Solutions:**
- ✅ Check `AD_BASE_DN` is correct
- ✅ Try simpler filter: `(objectClass=user)`
- ✅ Verify service account has read permissions
- ✅ Check users exist in specified OU

### ❌ "Connection timeout"

**Problem:** Can't reach ServiceDesk

**Solutions:**
- ✅ Check `PLATFORM_URL` is correct
- ✅ Test URL in browser
- ✅ Check firewall/proxy settings
- ✅ Verify ServiceDesk is running

---

## Configuration Reference

### Active Directory

| Variable | Example | Description |
|----------|---------|-------------|
| `AD_HOST` | `ldap://dc01.local:389` | LDAP server URL |
| `AD_USERNAME` | `sync@company.local` | Service account |
| `AD_PASSWORD` | `SecurePass123` | Account password |
| `AD_BASE_DN` | `DC=company,DC=local` | Search base |
| `AD_USER_SEARCH_BASE` | `CN=Users,DC=company,DC=local` | Where to find users |
| `AD_USER_SEARCH_FILTER` | `(objectClass=user)` | Which users to sync |
| `AD_USE_SSL` | `true` or `false` | Use LDAPS (port 636) |

### ServiceDesk Platform

| Variable | Example | Description |
|----------|---------|-------------|
| `PLATFORM_URL` | `http://localhost:3000` | ServiceDesk URL |
| `TENANT_ID` | `cm3sa8o4v000008l80k9wgfyq` | Your organization ID |
| `API_KEY` | `sdk_abc123...` | API key from settings |
| `SYNC_INTERVAL` | `3600` | Seconds between syncs |

---

## Security Best Practices

1. ✅ **Use a dedicated service account** with minimal permissions
2. ✅ **Use LDAPS (port 636)** in production environments
3. ✅ **Restrict .env file permissions** so only admin can read
4. ✅ **Rotate API keys** periodically
5. ✅ **Monitor logs** for suspicious activity
6. ✅ **Run agent on secure server** behind firewall

---

## Getting Help

### Check Logs
- Agent logs: `ad_sync.log` in agent folder
- ServiceDesk logs: Browser DevTools → Console

### Still Need Help?
1. Check this guide thoroughly
2. Review error messages in logs
3. Contact your IT administrator
4. Open an issue on GitHub (if applicable)

---

## Quick Reference Card

```
┌─────────────────────────────────────────────┐
│  ServiceDesk AD Sync - Quick Reference      │
├─────────────────────────────────────────────┤
│                                             │
│  Setup:     Double-click EASY-SETUP.bat     │
│  Start:     python ad_sync_agent.py         │
│  Stop:      Press Ctrl+C                    │
│  Logs:      ad_sync.log                     │
│                                             │
│  Web UI:    /dashboard/settings/ad-sync     │
│  API Keys:  Generate in web UI              │
│  Users:     Synced to /dashboard/users      │
│                                             │
└─────────────────────────────────────────────┘
```

**You're all set! Enjoy automatic user synchronization! 🎉**
