# 🚀 Quick Testing Guide

## 🎯 Start Here - Essential Tests (15 mins)

This guide helps you quickly test the most critical features of your ServiceDesk application.

---

## ✅ Step 1: Authentication (3 mins)

### Test Login with Different Roles

1. **Open:** http://localhost:3000/login

2. **Test Super Admin:**
   - Email: `superadmin@servicedesk.com`
   - Password: `superadmin`
   - ✓ Should redirect to `/dashboard`
   - ✓ Should have access to `/admin` panel

3. **Logout and Test Tenant Admin:**
   - Email: `admin@demo.com`
   - Password: `admin123`
   - ✓ Should see Demo Company dashboard

4. **Logout and Test Agent:**
   - Email: `agent@demo.com`
   - Password: `agent123`
   - ✓ Should see tickets assigned to them

5. **Logout and Test Regular User:**
   - Email: `user@demo.com`
   - Password: `user123`
   - ✓ Should see only their own tickets

---

## 🎫 Step 2: Ticket Management (5 mins)

### As Regular User (user@demo.com)

1. **View Existing Tickets:**
   - Go to: http://localhost:3000/dashboard/tickets
   - ✓ Should see 4 demo tickets
   - ✓ Click on a ticket to view details

2. **Create a New Ticket:**
   - Click "New Ticket" button
   - Fill in:
     - Title: "Test Ticket - Laptop keyboard issue"
     - Description: "Some keys are not working properly"
     - Category: "Hardware"
     - Priority: "HIGH"
   - Submit
   - ✓ Should appear in ticket list

3. **Add a Comment:**
   - Open the ticket you just created
   - Add comment: "The space bar and Enter key are not responding"
   - ✓ Comment should appear instantly

### As Agent (agent@demo.com)

4. **Assign and Update Ticket:**
   - Login as agent@demo.com
   - Go to the new ticket
   - Assign it to yourself
   - Change status to "IN_PROGRESS"
   - Add comment: "I'll check this today"
   - ✓ Status should update
   - ✓ Assignment should show your name

---

## 📊 Step 3: Dashboard & Analytics (2 mins)

### View Dashboard

1. **Go to:** http://localhost:3000/dashboard
2. **Verify you can see:**
   - ✓ Ticket count cards (Open, In Progress, Resolved, Total)
   - ✓ Recent tickets list
   - ✓ Charts/graphs (if implemented)
   - ✓ Quick stats

---

## 👥 Step 4: User & Tenant Management (3 mins)

### As Tenant Admin (admin@demo.com)

1. **View Users:**
   - Go to: http://localhost:3000/dashboard/users
   - ✓ Should see 4 users (superadmin, admin, agent, user)

2. **View Agents:**
   - Go to: http://localhost:3000/dashboard/agents
   - ✓ Should see agent list with workload

### As Super Admin (superadmin@servicedesk.com)

3. **Access Admin Panel:**
   - Go to: http://localhost:3000/admin
   - ✓ Should see system overview

4. **View Organizations:**
   - Go to: http://localhost:3000/admin/organizations
   - ✓ Should see Demo Company

---

## 📂 Step 5: Categories (2 mins)

1. **Login as admin@demo.com**

2. **View Categories:**
   - Go to: http://localhost:3000/dashboard/categories
   - ✓ Should see 4 categories:
     - Technical Support (blue)
     - Network and Connectivity (green)
     - Software (orange)
     - Hardware (red)

3. **Create New Category:**
   - Click "Add Category"
   - Name: "Security"
   - Color: Purple
   - ✓ Should appear in list

---

## 🚨 Critical Security Tests (5 mins)

### Test Data Isolation

1. **As user@demo.com:**
   - Note one of the ticket IDs (e.g., `123`)

2. **Create a second tenant (as superadmin):**
   - Login as superadmin@servicedesk.com
   - Go to: http://localhost:3000/dashboard/tenants/new
   - Create tenant "Test Company"
   - Create a user for that tenant

3. **Login as the new tenant's user:**
   - Try to access Demo Company's ticket:
     - Go to: http://localhost:3000/dashboard/tickets/[demo-ticket-id]
   - ✓ Should be blocked or show "Not Found"
   - ✓ Cannot see Demo Company tickets in list

### Test Role Permissions

1. **As user@demo.com:**
   - Try to access: http://localhost:3000/admin
   - ✓ Should be denied/redirected

2. **As agent@demo.com:**
   - Try to access: http://localhost:3000/dashboard/users
   - ✓ Should be denied or limited view

3. **As admin@demo.com:**
   - Try to access: http://localhost:3000/admin
   - ✓ Should be denied (only superadmin can access)

---

## 🔍 Quick Feature Checklist

After completing the above tests, verify these features work:

### Must-Have Features
- [ ] Login/Logout
- [ ] Create ticket
- [ ] View tickets
- [ ] Assign ticket
- [ ] Add comment
- [ ] Change ticket status
- [ ] Dashboard statistics
- [ ] User list
- [ ] Categories
- [ ] Role-based access control
- [ ] Multi-tenant isolation

### Should-Have Features
- [ ] Ticket filters (status, priority, category)
- [ ] Ticket search
- [ ] SLA policies
- [ ] Knowledge base
- [ ] Notifications
- [ ] Email notifications
- [ ] Asset management
- [ ] Custom fields
- [ ] Automation rules
- [ ] Webhooks

### Nice-to-Have Features
- [ ] Billing/subscription
- [ ] SSO integration
- [ ] LDAP/AD sync
- [ ] Telegram integration
- [ ] Advanced analytics
- [ ] API documentation
- [ ] Mobile responsive
- [ ] Dark mode

---

## 🐛 Common Issues to Check

### If you encounter errors:

1. **"Database connection error"**
   - Check PostgreSQL is running
   - Verify DATABASE_URL in `.env`

2. **"Unauthorized" or constant redirects**
   - Clear browser cookies
   - Check NEXTAUTH_SECRET is set
   - Verify NEXTAUTH_URL matches your URL

3. **"RLS policy violation"**
   - This is good! It means security is working
   - Check if you're logged in as the right user
   - Verify tenant isolation is working

4. **Pages not loading/404**
   - Check dev server is running: `npm run dev`
   - Verify the route exists
   - Check browser console for errors

5. **Stripe/billing errors**
   - Stripe test keys may not be configured
   - This is optional for testing core features

---

## 📝 Testing Tips

### Efficient Testing:
1. **Keep multiple browser tabs open** with different user logins
2. **Use incognito/private windows** for testing different roles simultaneously
3. **Check browser console** (F12) for JavaScript errors
4. **Check Network tab** for API errors
5. **Take screenshots** of any issues you find

### What to Look For:
- ✅ Features work as expected
- ✅ UI is responsive and intuitive
- ✅ Error messages are clear
- ✅ Data is isolated between tenants
- ✅ Permissions are enforced
- ❌ Application crashes
- ❌ Data leaks between tenants
- ❌ Unauthorized access
- ❌ UI breaks or looks wrong

---

## 📊 Testing Priority

**High Priority (Must Test):**
1. Authentication & Authorization
2. Ticket CRUD operations
3. Multi-tenant isolation
4. Role-based permissions
5. Data security

**Medium Priority (Should Test):**
6. Dashboard & analytics
7. User management
8. Categories & organization
9. Comments & communication
10. Search & filtering

**Low Priority (Nice to Test):**
11. Billing features
12. Advanced integrations (SSO, LDAP)
13. Telegram bot
14. Email notifications
15. Public marketing pages

---

## 🎉 Done!

After completing these tests, you'll have verified:
- ✅ Core functionality works
- ✅ Security and data isolation is functioning
- ✅ Role-based access control is enforced
- ✅ The app is ready for deeper feature testing

For comprehensive testing, see **TESTING_CHECKLIST.md** with 20+ feature categories!

---

## 🆘 Need Help?

- Check `README.md` for setup issues
- Review `.env` file for configuration
- Check server logs in the terminal
- Verify PostgreSQL connection: `npm run db:studio`
