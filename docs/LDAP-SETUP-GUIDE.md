# Active Directory Setup Guide for Organization Admins

## Quick Setup (2 Minutes)

### What You Need

1. **Server Address** - Your domain controller IP or name
   - Find it: Open Command Prompt and type: `echo %LOGONSERVER%`
   - Remove the `\\` - Example: `DC01` or `192.168.1.10`

2. **Domain Name** - Your company domain
   - Find it: In Command Prompt type: `echo %USERDNSDOMAIN%`
   - Example: `company.local` or `office.com`

3. **Admin Credentials** - Domain administrator username and password

### Steps

1. **Go to Settings → Active Directory / LDAP**

2. **Click "Connect Domain"**

3. **Fill in 5 simple fields:**
   - Connection Name: `Corporate AD` (or any name you want)
   - Server Address: Your domain controller (from step 1 above)
   - Domain: Your domain name (from step 2 above)
   - Admin Username: `administrator` (or your domain admin account)
   - Password: Your admin password

4. **Click "Test Connection"** to verify it works

5. **Click "Save & Import Users"**

✅ **Done!** All your Active Directory users are now imported and can sign in immediately.

---

## User Login

After setup, employees can sign in using:
- `domain\username` (Example: `company\john`)
- `username@domain` (Example: `john@company.local`)

They use their **Windows password** - no need to create separate accounts!

---

## Troubleshooting

### "Connection timeout"
- Check if server address is correct
- Make sure firewall allows port 389 (or 636 for SSL)
- Try using IP address instead of hostname

### "Invalid credentials"
- Verify admin username and password are correct
- Try: `administrator` instead of `domain\administrator`

### "Server not found"
- Ping the server address from Command Prompt
- Make sure you're on the company network (or VPN)

---

## Features After Setup

✅ **Single Sign-On** - Employees use Windows credentials  
✅ **Automatic Sync** - New AD users auto-imported daily  
✅ **Centralized Management** - Manage users in Active Directory  
✅ **Secure** - Passwords never stored, only verified against AD

---

## Advanced Options (Optional)

### Automatic User Sync

After creating the connection:
1. Click the "⚙️" icon next to your connection
2. Enable "Auto-sync"
3. Set interval (default: every hour)

Users added to AD will automatically appear in Service-Desk!

### Secure Connection (SSL)

If your domain controller supports LDAPS:
1. Click "Show advanced settings"
2. Enable "Use LDAPS"
3. Port changes to 636 automatically

---

## Need Help?

Contact your IT administrator or Service-Desk support.
