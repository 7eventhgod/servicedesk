# 🔑 Test Credentials & URLs - Quick Reference

## 🌐 Application URL
**Main App:** http://localhost:3000

---

## 👥 Test Accounts

### 🔥 Super Administrator (Global Access)
```
Email:    superadmin@servicedesk.com
Password: superadmin
Role:     ADMIN (Global)
Access:   Everything including /admin panel
```

### 👑 Tenant Administrator (Demo Company)
```
Email:    admin@demo.com
Password: admin123
Role:     TENANT_ADMIN
Access:   Full tenant management for Demo Company
```

### 👨‍💼 Support Agent
```
Email:    agent@demo.com
Password: agent123
Role:     AGENT
Access:   Ticket management, can assign/resolve tickets
```

### 👤 Regular User
```
Email:    user@demo.com
Password: user123
Role:     USER
Access:   Create tickets, view own tickets only
```

---

## 📍 Key URLs to Test

### Authentication
- Login: http://localhost:3000/login
- Register: http://localhost:3000/register

### Dashboard
- Main Dashboard: http://localhost:3000/dashboard
- Tickets List: http://localhost:3000/dashboard/tickets
- New Ticket: http://localhost:3000/dashboard/tickets/new
- Ticket Details: http://localhost:3000/dashboard/tickets/[id]

### Management
- Users: http://localhost:3000/dashboard/users
- Agents: http://localhost:3000/dashboard/agents
- Categories: http://localhost:3000/dashboard/categories
- Tenants: http://localhost:3000/dashboard/tenants

### Features
- SLA: http://localhost:3000/dashboard/sla
- Automation: http://localhost:3000/dashboard/automation
- Knowledge Base: http://localhost:3000/dashboard/knowledge
- Assets (CMDB): http://localhost:3000/dashboard/assets
- Custom Fields: http://localhost:3000/dashboard/custom-fields
- Queues: http://localhost:3000/dashboard/queues
- Filters: http://localhost:3000/dashboard/filters
- Webhooks: http://localhost:3000/dashboard/webhooks
- Notifications: http://localhost:3000/dashboard/notifications
- Billing: http://localhost:3000/dashboard/billing

### Settings
- General Settings: http://localhost:3000/dashboard/settings
- SSO Settings: http://localhost:3000/dashboard/settings/sso
- AD/LDAP Sync: http://localhost:3000/dashboard/settings/ad-sync
- Telegram: http://localhost:3000/dashboard/settings/telegram
- Notification Settings: http://localhost:3000/dashboard/settings/notifications
- LDAP Config: http://localhost:3000/dashboard/ldap

### Admin Panel (Super Admin Only)
- Admin Home: http://localhost:3000/admin
- Organizations: http://localhost:3000/admin/organizations
- Support Tickets: http://localhost:3000/admin/support-tickets
- System Health: http://localhost:3000/admin/system
- Modules: http://localhost:3000/admin/modules
- Tenant Groups: http://localhost:3000/admin/tenant-groups

### Public Pages
- Home: http://localhost:3000/
- Features: http://localhost:3000/features
- Pricing: http://localhost:3000/pricing
- About: http://localhost:3000/about
- Contact: http://localhost:3000/contact
- Docs: http://localhost:3000/docs

---

## 📊 Demo Data

### Categories (4)
1. **Technical Support** - Blue (#3b82f6)
2. **Network and Connectivity** - Green (#10b981)
3. **Software** - Orange (#f59e0b)
4. **Hardware** - Red (#ef4444)

### Tickets (4)
1. **Printer not working** - Open, High priority
2. **Install Adobe Photoshop** - In Progress, Medium priority (assigned to agent)
3. **Wi-Fi connection issue** - Resolved, Urgent priority
4. **Slow computer** - Open, Low priority

### Organizations
1. **Demo Company** (slug: demo) - Demo tenant with all test users

---

## 🚀 Quick Start Testing

### 1. Test Login Flow (2 mins)
```bash
1. Go to: http://localhost:3000/login
2. Login as: user@demo.com / user123
3. Verify dashboard loads
4. Logout
5. Repeat with other accounts
```

### 2. Test Ticket Creation (3 mins)
```bash
1. Login as: user@demo.com
2. Go to: http://localhost:3000/dashboard/tickets/new
3. Create a test ticket
4. Verify it appears in the list
5. Add a comment
```

### 3. Test Agent Workflow (3 mins)
```bash
1. Login as: agent@demo.com
2. View tickets list
3. Assign a ticket to yourself
4. Change status to IN_PROGRESS
5. Add a comment
6. Resolve the ticket
```

### 4. Test Admin Features (3 mins)
```bash
1. Login as: admin@demo.com
2. View users list
3. View categories
4. Create new category
5. Check dashboard statistics
```

### 5. Test Super Admin (3 mins)
```bash
1. Login as: superadmin@servicedesk.com
2. Access: http://localhost:3000/admin
3. View all organizations
4. View system health
5. Check global support tickets
```

---

## 🔒 Security Tests

### Test 1: Data Isolation
```bash
1. Login as user@demo.com
2. Note a ticket ID (e.g., /dashboard/tickets/1)
3. Logout
4. Login as different user
5. Try accessing that ticket URL
6. Should be blocked or not found
```

### Test 2: Role Permissions
```bash
1. Login as user@demo.com
2. Try: http://localhost:3000/admin
3. Should be redirected/denied
4. Try: http://localhost:3000/dashboard/users
5. Should have limited or no access
```

### Test 3: Unauthorized Access
```bash
1. Without logging in
2. Try: http://localhost:3000/dashboard
3. Should redirect to login
4. Try: http://localhost:3000/admin
5. Should redirect to login
```

---

## 🐛 Troubleshooting

### If Login Fails
- Clear browser cookies/cache
- Check NEXTAUTH_URL in .env matches your URL
- Verify PostgreSQL is running
- Check database has seed data: `npm run db:studio`

### If Pages Don't Load
- Confirm dev server is running: `npm run dev`
- Check terminal for errors
- Open browser console (F12) for JS errors
- Verify route exists in project structure

### If Database Errors
- Check connection: `npm run db:studio`
- Re-run migrations: `npm run db:push`
- Re-seed data: `npx prisma db seed`

---

## 📝 Test Result Template

Copy this template to track your testing:

```markdown
## Test Session: [Date]

### Authentication
- [ ] Super Admin Login
- [ ] Tenant Admin Login
- [ ] Agent Login
- [ ] User Login
- [ ] Logout

### Core Features
- [ ] Dashboard loads
- [ ] View tickets
- [ ] Create ticket
- [ ] Update ticket
- [ ] Add comment
- [ ] Assign ticket
- [ ] Resolve ticket

### Security
- [ ] Data isolation works
- [ ] Role permissions enforced
- [ ] Unauthorized access blocked

### Issues Found
1. 
2. 
3. 

### Notes
```

---

## 🎯 Testing Priorities

**Critical (Must Work):**
- ✅ Login/Authentication
- ✅ Ticket CRUD operations
- ✅ Multi-tenant isolation
- ✅ Role-based access

**Important (Should Work):**
- ✅ Dashboard & stats
- ✅ User management
- ✅ Categories
- ✅ Comments & communication

**Optional (Nice to Have):**
- ✅ Billing features
- ✅ SSO integration
- ✅ LDAP/AD sync
- ✅ Telegram bot
- ✅ Email notifications

---

## 📚 Additional Resources

- **Full Testing Guide:** `QUICK_TEST_GUIDE.md`
- **Comprehensive Checklist:** `TESTING_CHECKLIST.md`
- **Setup Guide:** `README.md`
- **Database Studio:** Run `npm run db:studio` to view/edit data

---

**Happy Testing! 🎉**
