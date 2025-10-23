# Quick Fix Guide - Registration & Google Login

## Current Status
✅ Backend server running at http://127.0.0.1:8000
✅ Database `ai_mock` connected
✅ Frontend .env created with correct API URL

## Steps to Fix Registration & Google Login

### 1. Run Database Migrations (Critical!)
Open a NEW PowerShell terminal and run:
```powershell
cd C:\xampp\htdocs\Ai_Mock_Interviews\backend
php artisan migrate
```

This creates the `users` table and other required tables. If you see "Nothing to migrate", that's okay - tables already exist.

### 2. Start Frontend Dev Server
In another terminal:
```powershell
cd C:\xampp\htdocs\Ai_Mock_Interviews\frontend
npm install
npm run dev
```

The Node.js version warning is harmless - the app will still work.

### 3. Test Registration
1. Open http://localhost:5173 in your browser
2. Click "Register" or go to http://localhost:5173/register
3. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
   - Check "I agree to the Terms"
4. Click "Create account"

**If it works:** You'll be redirected to /setup with a success toast.

**If it fails with "Cannot reach API":**
- Ensure backend terminal shows: `INFO  Server running on [http://127.0.0.1:8000]`
- Check frontend/.env has: `VITE_API_BASE_URL=http://127.0.0.1:8000/api`
- Restart frontend dev server after changing .env

**If it fails with SQL errors:**
- Run `php artisan migrate` in backend folder
- Check XAMPP MySQL is running

### 4. Enable Google Login (Optional)

#### Get Google Client ID:
1. Go to https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 Client ID (Web application)
3. Add to Authorized JavaScript origins:
   - `http://localhost:5173`
4. Copy the Client ID

#### Configure Frontend:
1. Open `C:\xampp\htdocs\Ai_Mock_Interviews\frontend\.env`
2. Set:
   ```
   VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE.apps.googleusercontent.com
   ```
3. Restart frontend dev server

#### Test Google Login:
1. Go to http://localhost:5173/login
2. Click "Continue with Google"
3. Select your Google account
4. You should be redirected to /setup

### 5. Use Guest Mode (No Backend Required)
If backend is down or you want to test frontend-only:
1. Click "Continue as guest (demo)" on login/register
2. Explore the UI without API calls

## Common Issues & Solutions

### "Cannot reach API"
**Cause:** Backend not running or wrong URL
**Fix:** 
- Ensure backend terminal shows server running
- Check frontend/.env has correct VITE_API_BASE_URL
- Restart frontend: Ctrl+C, then `npm run dev`

### "Invalid credentials" on existing email
**Cause:** Email already registered
**Fix:** Use a different email or login with existing credentials

### SQL errors mentioning `users` table
**Cause:** Migrations not run
**Fix:** `php artisan migrate` in backend folder

### Google button disabled
**Cause:** VITE_GOOGLE_CLIENT_ID not set
**Fix:** Set it in frontend/.env and restart dev server

### CORS errors in browser console
**Cause:** Backend CORS not allowing localhost:5173
**Fix:** Already configured in backend/config/cors.php - shouldn't happen

## Verification Checklist
- [ ] Backend running: Check terminal shows `Server running on [http://127.0.0.1:8000]`
- [ ] XAMPP MySQL running: Green indicator in XAMPP Control Panel
- [ ] Database exists: `ai_mock` visible in phpMyAdmin
- [ ] Migrations run: `php artisan migrate:status` shows all migrations done
- [ ] Frontend .env exists: Contains `VITE_API_BASE_URL=http://127.0.0.1:8000/api`
- [ ] Frontend running: http://localhost:5173 loads the login page

## Quick Test Commands

Test registration via curl (PowerShell):
```powershell
Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/auth/register" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"name":"Test","email":"test2@example.com","password":"password123"}' | Select-Object -Expand Content
```

Expected response: JSON with `token` and `user` fields.

## Need More Help?

If registration still fails:
1. Check the backend terminal for red error messages
2. Open browser DevTools (F12) > Console tab
3. Try to register and look for red errors
4. Copy the exact error message

Common backend errors:
- "SQLSTATE[42S02]: Table not found" → Run migrations
- "SQLSTATE[HY000] [2002]" → MySQL not running in XAMPP
- "Class 'App\Models\User' not found" → Run `composer install` in backend

The app is now configured correctly - just need to run migrations and both servers!
