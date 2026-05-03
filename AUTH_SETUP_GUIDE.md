# Authentication Setup & Testing Guide

## ✅ What Has Been Fixed

### 1. **Log In Feature** ✅

- Added `/api/login` endpoint in backend API
- Frontend login now calls backend authentication
- Error handling for invalid credentials

### 2. **Forgot Password Feature** ✅

- Created new `ForgotPasswordForm` component
- Added `/api/forgot-password` endpoint
- Added `/api/reset-password` endpoint
- Integrated into Login page

### 3. **Sign Up Feature** ✅

- Fixed Supabase configuration to use correct project URL
- Backend signup endpoint operational
- Data validation in place

### 4. **Admin Login** ✅

- Admin authentication service configured
- Login modal in place

---

## ❌ What Still Needs Configuration

### **Critical: Add Supabase Credentials to .env**

Your `.env` file currently has empty Supabase keys. You need to add:

```env
VITE_SUPABASE_URL=https://lubtgetltlnnbnzzkacd.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_key_here
```

**Where to get these:**

1. Go to your Supabase project dashboard
2. Click "Settings" → "API"
3. Copy the "Project URL" and "anon public" key
4. Copy the "service_role" key from the same page

---

## 🧪 Testing the Authentication Features

### **Test Case 1: Sign Up / Create New Account**

1. Navigate to `http://localhost:3000/signup`
2. Fill in the form with test data:
   - Name: `Test User`
   - Email: `testuser@example.com`
   - Password: `TestPassword123`
   - Complete all fields
3. Click "Create Account"
4. **Expected Result**: User created and redirected to dashboard

### **Test Case 2: Log In**

1. Navigate to `http://localhost:3000/` (login page)
2. Enter credentials:
   - Email: `testuser@example.com`
   - Password: `TestPassword123`
3. Click "Sign In"
4. **Expected Result**: Logged in and redirected to dashboard

### **Test Case 3: Forgot Password**

1. On login page, click "Forgot password?" link
2. Enter email: `testuser@example.com`
3. Click "Send Reset Link"
4. **Expected Result**: Success message shown
5. Check email for reset link (in production)

### **Test Case 4: Admin Login**

1. Click "Admin" button in header
2. Enter admin credentials
3. **Expected Result**: Admin dashboard loads with user management

---

## 🚀 How to Start

### 1. **Update .env with Supabase Credentials**

```bash
# Edit backend/.env
SUPABASE_URL=https://lubtgetltlnnbnzzkacd.supabase.co
SUPABASE_SERVICE_KEY=your_service_key
VITE_SUPABASE_URL=https://lubtgetltlnnbnzzkacd.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 2. **Start Backend Server**

```bash
cd backend
python -m uvicorn api:app --reload --host 0.0.0.0 --port 8000
```

### 3. **Start Frontend Dev Server**

```bash
cd project_root
npm run dev
```

### 4. **Test Authentication Flow**

- Go to `http://localhost:3000`
- Try signup, login, and forgot password flows

---

## 📋 Endpoints Overview

### **Authentication Endpoints (Backend)**

- `POST /api/login` - User login
- `POST /api/signup` - User signup
- `POST /api/forgot-password` - Request password reset
- `POST /api/reset-password` - Confirm password reset
- `POST /api/supabase/login` - Admin login

### **Response Formats**

**Login Success:**

```json
{
  "success": true,
  "userId": "U12345",
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Login successful"
}
```

**Login Error:**

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

## 🔧 Troubleshooting

### **"Invalid credentials" on login**

- Verify user exists in Supabase MUFG table
- Check password is stored correctly
- Check email/username field matches

### **Forgot Password page not showing**

- Ensure ForgotPasswordForm component is imported
- Check Login.tsx has the forgot password button handler

### **Backend endpoints not responding**

- Verify backend is running on port 8000
- Check CORS middleware allows frontend origin
- Check .env file is properly loaded

### **Supabase connection error**

- Verify SUPABASE_URL and SUPABASE_SERVICE_KEY are set
- Check Supabase project is active
- Verify MUFG table exists with correct schema

---

## 📝 Next Steps

1. **Add Supabase credentials to .env**
2. **Restart backend and frontend servers**
3. **Test all 4 authentication flows**
4. **Create test admin user if needed**
5. **Verify data is being saved to Supabase**
