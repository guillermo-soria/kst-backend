# 🔧 Railway Deployment Troubleshooting

## 🚨 CURRENT CRITICAL ISSUE (2024-12-20 02:20)

### **🔴 CRITICAL: REDIS CONNECTION FAILURE (DNS ERROR)**

**Current Error in Logs**:
```
Error: getaddrinfo ENOTFOUND redis-g6xi.railway.internal
Cannot destructure property 'url' of 'redisConnectionUrl' as it is undefined
[wrn] Local Event Bus installed. This is not recommended for production.
Module initialization failed: EventBusService
```

**Root Cause**:
The `REDIS_URL` environment variable contains an **invalid/outdated hostname** (`redis-g6xi.railway.internal`) that cannot be resolved. This forces Medusa to use local fallbacks instead of Redis.

**🚨 URGENT SOLUTION (Follow Exactly)**:

#### **Step 1: Verify Redis Service Status**
1. Go to [railway.app](https://railway.app) → Your Project
2. Confirm you see: **Backend**, **PostgreSQL**, **Redis** services
3. Redis service must show **"Active"** status (if stopped, deploy it first)

#### **Step 2: Get NEW Redis URL** 
1. **Click Redis Service** (database icon, NOT backend)
2. Click **"Variables"** tab  
3. Find `REDIS_URL` and **copy the COMPLETE value**
4. Should look like: `redis://default:PASSWORD@redis-NEW.railway.internal:6379`
5. **Critical**: Hostname should NOT be `redis-g6xi.railway.internal`

#### **Step 3: Update Backend Service**
1. **Click Backend Service**
2. Click **"Variables"** tab
3. Find `REDIS_URL` → Click **"Edit"**  
4. **Paste the EXACT URL** from Step 2
5. Ensure these variables exist:
   ```bash
   REDIS_URL=redis://default:ACTUAL_PASSWORD@CORRECT_HOST:6379
   PORT=9000
   NODE_ENV=production
   JWT_SECRET=kst-super-secret-jwt-key-2024-change-this-in-production
   COOKIE_SECRET=kst-super-secret-cookie-key-2024-change-this-in-production
   DATABASE_URL=postgresql://postgres:PASSWORD@postgres.railway.internal:5432/railway
   ```

#### **Step 4: Force Redeploy & Verify**
1. Click **"Deploy"** in Backend service
2. Wait for build completion 
3. Click **"View Logs"** and look for:
   ```
   ✅ SUCCESS INDICATORS:
   - Redis connection successful
   - EventBus (Redis) initialized  
   - Cache (Redis) initialized
   - Workflows (Redis) initialized
   
   ❌ FAIL INDICATORS:
   - ENOTFOUND redis-g6xi
   - Local Event Bus installed
   - falling back to in-memory
   ```

#### **Step 5: Test Health Endpoints**
Replace `YOUR_URL` with your actual backend URL:
- `https://YOUR_URL.railway.app/health` → Should return `200 OK`
- `https://YOUR_URL.railway.app/admin/health` → Should return `200 OK`

## Common Issues and Solutions

### Issue 1: Redis URL Format Issues

**Symptoms**:
- `ENOTFOUND` DNS errors
- `Cannot destructure property 'url'` errors
- Backend fails to start

**Solutions**:
1. **Use EXACT Redis URL from Railway**:
   - Never modify the Redis URL manually
   - Use the exact value provided by Railway Redis service
   - Format: `redis://default:[password]@[host].railway.internal:6379`

2. **Verify Redis service connection**:
   - Redis service must be in same Railway project
   - Backend service must have access to Redis service variables

### Issue 2: Port/CORS Errors

**Symptoms**:
- Backend starts but returns 404/CORS errors
- Cannot access admin or API endpoints

**Solutions**:
1. **Verify PORT variable**:
   ```bash
   PORT=9000  # Must be set manually
   ```

2. **Update CORS domains**:
   Replace with your actual Railway domain:
   ```bash
   STORE_CORS=https://your-actual-domain.railway.app
   ADMIN_CORS=https://your-actual-domain.railway.app
   AUTH_CORS=https://your-actual-domain.railway.app
   ```

### Issue 3: Database Connection Issues

**Symptoms**:
- "Database connection failed" errors
- Migration errors during startup

**Solutions**:
1. **Check DATABASE_URL**:
   - Should be auto-created with PostgreSQL service
   - Format: `postgresql://user:pass@host:port/database`

2. **Run migrations manually**:
   ```bash
   # In Railway dashboard → backend service → terminal:
   npm run build
   npm run db:migrate
   ```

### Issue 4: Missing Environment Variables

**Complete list of required variables**:

```bash
# Security (REQUIRED)
JWT_SECRET=your-generated-secret
COOKIE_SECRET=your-generated-secret

# System (REQUIRED)
NODE_ENV=production
PORT=9000

# Database (AUTO-CREATED)
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# CORS (UPDATE WITH YOUR DOMAIN)
STORE_CORS=https://your-domain.railway.app
ADMIN_CORS=https://your-domain.railway.app
AUTH_CORS=https://your-domain.railway.app

# Optional but recommended
SESSION_SECRET=your-generated-secret
```

### Issue 5: Build/Start Script Issues

**If build fails**:
1. **Check build script** in `backend/package.json`:
   ```json
   {
     "scripts": {
       "build": "medusa build",
       "railway:start": "medusa start -p $PORT"
     }
   }
   ```

2. **Manual build and start**:
   ```bash
   # In Railway terminal:
   cd backend
   npm install
   npm run build
   npm run railway:start
   ```

## Debug Commands

### Check Environment Variables
```bash
# In Railway backend service terminal:
env | grep -E "(PORT|REDIS|DATABASE|JWT|COOKIE)"
```

### Test Health Endpoints
```bash
# From your local machine:
curl https://your-app.railway.app/health
curl https://your-app.railway.app/admin/health
```

### Check Database Connection
```bash
# In Railway backend terminal:
npm run db:migrate
```

### Test Redis Connection
```bash
# In Railway backend terminal:
node -e "console.log('Redis URL:', process.env.REDIS_URL)"
```

## Railway Dashboard Quick Links

1. **Project Dashboard**: https://railway.app/dashboard
2. **Environment Variables**: Project → Settings → Variables
3. **Service Logs**: Project → Service → Logs
4. **Service Terminal**: Project → Service → Terminal
5. **Deployments**: Project → Service → Deployments

## Getting Help

### Where to Look First:
1. **Railway Logs**: Check for specific error messages
2. **Service Status**: Ensure all services (PostgreSQL, Redis, Backend) are green
3. **Environment Variables**: Verify all required variables are set
4. **Build Logs**: Check if build process completed successfully

### Log Analysis:
- **Red logs**: Critical errors that stop deployment
- **Yellow logs**: Warnings (usually safe to ignore)
- **Blue logs**: Info messages (build progress, startup messages)

### Most Common Success Indicators:
```
✅ "Server is ready on port 9000"
✅ "Database connected successfully"
✅ "Redis connected successfully"
✅ "Medusa server started"
```

## Emergency Reset

If everything breaks and you need to start fresh:

1. **Delete all services** in Railway project
2. **Re-add PostgreSQL** service
3. **Re-add Redis** service  
4. **Re-add Backend** service (connect to GitHub repo)
5. **Re-add all environment variables** from `RAILWAY_ENV_VARS.md`
6. **Wait for automatic deployment**

---

**Remember**: 99% of Railway deployment issues are missing environment variables or services. Always check these first! 🚀

## 🔴 CRITICAL: Monorepo Structure Causing Deployment Issues

### **MONOREPO CONFIGURATION PROBLEM**

**Root Cause**:
Railway is trying to deploy from `/kst-backend/` (root) but your Medusa app is in `/kst-backend/backend/`. This creates multiple issues:

1. **Wrong package.json**: Railway uses root `package.json` instead of `backend/package.json`
2. **Missing scripts**: `railway:start` script is in `backend/package.json`, not root
3. **Config conflicts**: Multiple `medusa-config.js` files causing confusion
4. **Context issues**: Environment variables and Redis connections fail because of wrong working directory

**Symptoms**:
```
❌ npm ERR! missing script: railway:start
❌ Cannot find module 'medusa-config'
❌ ENOTFOUND redis errors (wrong context)
❌ Database connection issues
```

**🚨 IMMEDIATE SOLUTIONS**:

### **Solution 1: Configure Railway Root Directory (PREFERRED)**
1. Go to Railway Dashboard → Backend Service → **"Settings"**
2. Find **"Root Directory"** or **"Source"** setting
3. Set to: `backend` (without leading slash)
4. Save and redeploy

### **Solution 2: Use Proxy Scripts (BACKUP)**
We've updated the root `package.json` with proxy scripts:
```json
{
  "scripts": {
    "build": "cd backend && npm run build",
    "railway:start": "cd backend && npm run railway:start",
    "db:migrate": "cd backend && npm run db:migrate"
  }
}
```

### **Solution 3: Clean Up Config Conflicts**
Renamed conflicting files:
- `medusa-config.js` → `medusa-config-OLD.js` 
- `medusa-config-simple.js` → `medusa-config-simple-OLD.js`

**Verification Steps**:
1. Railway build logs should show: `Found package.json with railway:start`
2. Should load `medusa-config.ts` from correct location
3. Redis connection should work (correct context)
4. Database migrations should run successfully
