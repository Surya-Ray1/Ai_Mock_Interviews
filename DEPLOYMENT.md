# 🚀 Free Deployment Guide for AI Mock Interviews

## Option 1: Railway.app (Recommended - $5/month free credit)

### Step 1: Deploy Backend + Database

1. **Go to:** https://railway.app
2. **Sign up** with GitHub (free, no credit card needed)
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your repository:** `Surya-Ray1/Ai_Mock_Interviews`
6. **Add MySQL Database:**
   - Click "New" → "Database" → "Add MySQL"
   - Railway will auto-configure the connection

7. **Configure Backend Service:**
   - Click on your service → "Settings"
   - **Root Directory:** `backend`
   - **Start Command:** `bash railway-start.sh`
   - **Environment Variables** (click "Variables"):
     ```
     APP_KEY=base64:irz+P5H/shEI/09gmaVM4JEq1blsq9773JbmflPfA7c=
     APP_ENV=production
     APP_DEBUG=false
     
     DB_CONNECTION=mysql
     DB_HOST=${{MYSQL_HOST}}
     DB_PORT=${{MYSQL_PORT}}
     DB_DATABASE=${{MYSQL_DATABASE}}
     DB_USERNAME=${{MYSQL_USER}}
     DB_PASSWORD=${{MYSQL_PASSWORD}}
     
     SESSION_DRIVER=database
     FRONTEND_ORIGIN=https://your-frontend-url.vercel.app
     
     AI_ENGINE=openai
     OPENAI_API_KEY=your-openai-key
     
     RAZORPAY_KEY_ID=your-razorpay-key
     RAZORPAY_KEY_SECRET=your-razorpay-secret
     
     FREE_MAX_USER_TURNS=5
     FREE_MAX_SECONDS=60
     ADMIN_KEY=your-secret-admin-key
     PRO_PRICE_PAISE=29900
     ```

8. **Deploy** - Railway will automatically build and deploy

### Step 2: Deploy Frontend on Vercel

1. **Go to:** https://vercel.com
2. **Sign up** with GitHub (free)
3. **Click "New Project"**
4. **Import your GitHub repository**
5. **Configure:**
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Environment Variables:**
     ```
     VITE_API_BASE_URL=https://your-backend-url.railway.app/api
     VITE_ENABLE_PAYMENTS=true
     ```

6. **Deploy** - Vercel will build and deploy in ~2 minutes

### Step 3: Update CORS

After deployment, update backend `.env` on Railway:
```
FRONTEND_ORIGIN=https://your-app.vercel.app
```

---

## Option 2: Render.com (Free tier with limitations)

### Backend + Database (Render)

1. **Go to:** https://render.com
2. **Sign up** (free)
3. **Create PostgreSQL Database:**
   - Click "New +" → "PostgreSQL"
   - Name: `ai-mock-db`
   - Free plan selected

4. **Create Web Service:**
   - Click "New +" → "Web Service"
   - Connect GitHub repo
   - **Root Directory:** `backend`
   - **Build Command:** `composer install`
   - **Start Command:** `php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT`
   - **Environment Variables:** (same as Railway above, but use Render's Postgres)

**Note:** Render free tier spins down after 15min inactivity (slow cold starts)

### Frontend (Vercel)
Same as Option 1 above

---

## Option 3: Frontend Only (GitHub Pages) + Keep Backend Local

If you want to deploy just the frontend for demos:

1. **Already configured!** Your GitHub Actions workflow is ready
2. **Just push to main branch:**
   ```bash
   git push origin main
   ```
3. **Enable GitHub Pages:**
   - Go to: https://github.com/Surya-Ray1/Ai_Mock_Interviews/settings/pages
   - Source: GitHub Actions
   - Your site will be at: https://surya-ray1.github.io/Ai_Mock_Interviews/

4. **For backend:** Keep running locally or use ngrok for public access

---

## Option 4: All-in-One with Coolify (Self-hosted)

If you have a VPS or want to use Oracle Cloud Free Tier:

1. **Get Oracle Cloud Free Tier** (forever free VM)
2. **Install Coolify** on the VM
3. **Deploy full stack** with one click

---

## 📊 Comparison

| Platform | Backend | Database | Frontend | Cost | Ease |
|----------|---------|----------|----------|------|------|
| **Railway + Vercel** | ✅ | MySQL ✅ | ✅ | $5/mo free credit | ⭐⭐⭐⭐⭐ |
| **Render + Vercel** | ✅ | PostgreSQL ✅ | ✅ | Free (slow) | ⭐⭐⭐⭐ |
| **GitHub Pages** | ❌ Local | ❌ Local | ✅ | Free | ⭐⭐⭐ |
| **Oracle + Coolify** | ✅ | ✅ | ✅ | Free forever | ⭐⭐ |

---

## 🎯 My Recommendation

**For you:** Use **Railway + Vercel**

**Why:**
- ✅ Easiest setup (15 minutes total)
- ✅ No credit card needed
- ✅ Auto-deploys from GitHub
- ✅ MySQL database included
- ✅ $5/month credit is enough for development
- ✅ Fast performance
- ✅ Free SSL certificates
- ✅ Can upgrade later if needed

**Steps:**
1. Deploy backend + MySQL on Railway (~10 min)
2. Deploy frontend on Vercel (~5 min)
3. Update environment variables
4. Done! 🎉

---

## 🆘 Need Help?

After choosing a platform, let me know and I'll guide you through the specific deployment steps!
