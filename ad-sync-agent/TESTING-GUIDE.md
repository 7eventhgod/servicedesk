# Testing Guide - AD Sync Agent

## ❓ Do I Need to Deploy to Cloud for Testing?

**NO!** You can test everything locally on your computer.

---

## 🧪 Testing Scenarios

### **Scenario 1: Full Local Testing (Recommended for Development)**

**Best for:** Initial testing, development, debugging

```
Your Computer Only
┌─────────────────────────────────┐
│                                 │
│  ServiceDesk (localhost:3000)   │
│         ↑                       │
│         │ HTTP                  │
│         │                       │
│  AD Sync Agent                  │
│         ↑                       │
│         │ LDAP                  │
│         │                       │
│  AD Server (or test LDAP)       │
│                                 │
└─────────────────────────────────┘
```

**Setup:**

1. **Start ServiceDesk locally:**
   ```bash
   # In servicedesk folder
   npm run dev
   ```
   Opens at: `http://localhost:3000`

2. **Configure agent for localhost:**
   ```env
   # In ad-sync-agent/.env
   PLATFORM_URL=http://localhost:3000
   TENANT_ID=your-tenant-id-from-web-ui
   API_KEY=your-generated-api-key
   ```

3. **Run agent:**
   ```bash
   cd ad-sync-agent
   python ad_sync_agent.py
   ```

✅ **No internet required**
✅ **Fast debugging**
✅ **See logs in real-time**

---

### **Scenario 2: Local Agent + Cloud ServiceDesk**

**Best for:** Testing with real deployment

```
Your Network              Internet
┌──────────────┐         ┌─────────────────┐
│  AD Server   │         │  ServiceDesk    │
│      ↑       │  HTTPS  │  (Cloud)        │
│      │       │ ──────> │  https://...    │
│  AD Agent    │         │                 │
└──────────────┘         └─────────────────┘
```

**Setup:**

1. **Deploy ServiceDesk to cloud** (Vercel, Railway, etc.)

2. **Configure agent with cloud URL:**
   ```env
   PLATFORM_URL=https://your-app.vercel.app
   ```

3. **Run agent on your network**

✅ **Tests real production setup**
✅ **Tests firewall rules**
⚠️ **Requires deployment**

---

### **Scenario 3: Mock Testing (No Real AD)**

**Best for:** Testing without Active Directory

You can test the **web UI and API flow** without having AD:

1. **Start ServiceDesk:**
   ```bash
   npm run dev
   ```

2. **Test the UI:**
   - Go to: http://localhost:3000/dashboard/settings/ad-sync
   - Generate API Key ✓
   - See endpoint information ✓
   - Verify UI works ✓

3. **Mock the agent:** Modify `ad_sync_agent.py` to use fake user data

---

## 🎯 Recommended Testing Flow

### Phase 1: UI Testing (No AD needed)
```bash
npm run dev
# Visit: http://localhost:3000/dashboard/settings/ad-sync
# Generate API key
# Verify UI works
```

### Phase 2: API Testing (Mock data)
```bash
# Modify agent to use fake users
python ad_sync_agent.py
# Check users appear in ServiceDesk
```

### Phase 3: Real AD Testing (Local)
```bash
# Configure real AD settings in .env
python ad_sync_agent.py
# Verify real users sync
```

### Phase 4: Production Testing (Cloud)
```bash
# Deploy to cloud
# Update .env with cloud URL
python ad_sync_agent.py
# Test from on-premise network
```

---

## 🔧 Quick Test Without AD

If you want to test the **sync API** without Active Directory:

### Create Test Script

Create `test_sync.py`:

```python
import requests
import json

# Your ServiceDesk details
PLATFORM_URL = "http://localhost:3000"
TENANT_ID = "your-tenant-id"
API_KEY = "your-api-key"

# Fake test users
test_users = [
    {
        "email": "john.doe@test.com",
        "name": "John Doe",
        "active": True,
        "groups": ["IT Staff", "Domain Users"],
        "attributes": {}
    },
    {
        "email": "jane.smith@test.com",
        "name": "Jane Smith",
        "active": True,
        "groups": ["HR", "Domain Users"],
        "attributes": {}
    }
]

# Send to API
url = f"{PLATFORM_URL}/api/tenants/{TENANT_ID}/sync/users"
headers = {
    "Content-Type": "application/json",
    "X-AD-Sync-Api-Key": API_KEY
}

response = requests.post(url, json={"users": test_users}, headers=headers)

print(f"Status: {response.status_code}")
print(f"Response: {response.json()}")
```

**Run it:**
```bash
python test_sync.py
```

**Check users appeared in ServiceDesk UI!**

---

## 🚀 Development Workflow

```bash
# 1. Start ServiceDesk
npm run dev

# 2. In another terminal - start agent
cd ad-sync-agent
python ad_sync_agent.py

# 3. See logs in both terminals
# 4. Make changes and restart as needed
```

---

## 📊 What Gets Tested in Each Scenario

| Feature | Local | Local + Cloud | Mock |
|---------|-------|---------------|------|
| Web UI | ✅ | ✅ | ✅ |
| API Key Generation | ✅ | ✅ | ✅ |
| API Authentication | ✅ | ✅ | ✅ |
| User Sync | ✅ | ✅ | ✅ |
| AD Connection | ⚠️ Need AD | ⚠️ Need AD | ❌ |
| Network/Firewall | ❌ | ✅ | ❌ |
| SSL/HTTPS | ❌ | ✅ | ❌ |

---

## 🎓 Best Practices

### For Development
- ✅ Use localhost
- ✅ Use mock data initially
- ✅ Test with small user sets
- ✅ Keep logs visible

### For Staging
- ✅ Use real AD (test environment)
- ✅ Test with production-like data
- ✅ Test error scenarios
- ✅ Test scheduling

### For Production
- ✅ Deploy to cloud
- ✅ Use real AD
- ✅ Test from actual network
- ✅ Monitor logs carefully

---

## ⚠️ Important Notes

### Internet NOT Required for Testing
- ServiceDesk on `localhost:3000` works fine
- Agent can connect to `http://localhost:3000`
- AD can be on same machine or network
- **No cloud deployment needed**

### When You DO Need Internet
- Testing with real cloud deployment
- Testing firewall rules
- Testing production setup
- Testing from remote locations

### Performance Note
- Local testing is **faster** (no network latency)
- Cloud testing is **slower** but more realistic

---

## 📝 Checklist

Before saying "it doesn't work":

- [ ] ServiceDesk is running (check `http://localhost:3000`)
- [ ] API key is generated in ServiceDesk
- [ ] `.env` file has correct `PLATFORM_URL`
- [ ] `.env` file has correct `TENANT_ID`
- [ ] `.env` file has correct `API_KEY`
- [ ] Python dependencies installed (`pip install -r requirements.txt`)
- [ ] Check agent logs (`ad_sync.log`)
- [ ] Check ServiceDesk logs (browser console)

---

## 🆘 Common Testing Issues

### "Cannot connect to platform"
```bash
# Make sure ServiceDesk is running
npm run dev

# Check it's accessible
curl http://localhost:3000
```

### "Invalid API key"
```bash
# Regenerate in ServiceDesk:
# Settings → AD Sync → Generate API Key
```

### "Module not found"
```bash
# Install dependencies
pip install -r requirements.txt
```

---

## 🎉 Summary

**For Testing:**
- Start with **localhost** (no cloud needed)
- Test the **web UI first**
- Test with **mock data** if no AD
- Test with **real AD** when ready
- Deploy to **cloud** only when all works locally

**You DO NOT need internet hosting to test the AD sync functionality!**

---

## 🔗 Related Docs

- `COMPLETE-SETUP-GUIDE.md` - Full production setup
- `WHERE-TO-GET-API-KEY.md` - API credentials
- `★ START-HERE ★.txt` - Quick start

---

**Need help? Start with local testing first!** 🚀
