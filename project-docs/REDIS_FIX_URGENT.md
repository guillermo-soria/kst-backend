# 🚨 URGENT: Fix Redis DNS Error

## Current Problem
Your logs show:
```
Error: getaddrinfo ENOTFOUND redis-g6xi.railway.internal
```

This means your `REDIS_URL` environment variable is pointing to an **old or invalid hostname**.

## ✅ SOLUTION STEPS

### Step 1: Access Railway Dashboard
1. Go to [railway.app](https://railway.app)
2. Open your project
3. You should see multiple services (Backend, PostgreSQL, Redis)

### Step 2: Get Correct Redis URL
1. **Click on your Redis service** (not backend)
2. Go to **"Variables" tab**
3. Look for `REDIS_URL` variable
4. **Copy the EXACT value** - it should look like:
   ```
   redis://default:SOME_PASSWORD@redis-xyz.railway.internal:6379
   ```
   **NOT**: `redis://default:SOME_PASSWORD@redis-g6xi.railway.internal:6379`

### Step 3: Update Backend Variables
1. **Click on your Backend service**
2. Go to **"Variables" tab**
3. Find `REDIS_URL` and **click Edit**
4. **Paste the NEW Redis URL** from Step 2
5. Make sure these variables exist:
   ```
   PORT=9000
   NODE_ENV=production
   REDIS_URL=redis://default:ACTUAL_PASSWORD@NEW_HOSTNAME:6379
   DATABASE_URL=postgresql://postgres:PASSWORD@postgres.railway.internal:5432/railway
   JWT_SECRET=kst-super-secret-jwt-key-2024-change-this-in-production
   COOKIE_SECRET=kst-super-secret-cookie-key-2024-change-this-in-production
   STORE_CORS=https://YOUR_BACKEND_URL.railway.app
   ADMIN_CORS=https://YOUR_BACKEND_URL.railway.app
   AUTH_CORS=https://YOUR_BACKEND_URL.railway.app
   ```

### Step 4: Force Redeploy
1. In Backend service, click **"Deploy"** or **"Redeploy"**
2. Wait for deployment to complete

### Step 5: Check Logs
1. Click on **"View Logs"** in Backend service
2. Look for:
   ```
   ✅ SUCCESS: Redis Event Bus initialized successfully
   ✅ SUCCESS: Redis Cache initialized successfully  
   ✅ SUCCESS: Redis Workflows initialized successfully
   ```
   
   **NOT**:
   ```
   ❌ Local Event Bus installed. This is not recommended for production.
   ❌ getaddrinfo ENOTFOUND redis-g6xi.railway.internal
   ```

## 🔍 How to Verify It's Working

### Test 1: Health Endpoints
Visit these URLs (replace YOUR_BACKEND_URL):
- `https://YOUR_BACKEND_URL.railway.app/health`
- `https://YOUR_BACKEND_URL.railway.app/admin/health`
- `https://YOUR_BACKEND_URL.railway.app/store/health`

All should return `{"status": "ok"}` or similar.

### Test 2: Check Logs
Look for startup messages without Redis connection errors.

## 🚨 If Still Not Working

### Possible Issue 1: Redis Service Down
- Check if your Redis service in Railway is **"Active"**
- If stopped, click **"Deploy"** on Redis service

### Possible Issue 2: Wrong Redis URL Format
The Redis URL must be EXACTLY as provided by Railway's Redis service variables.

### Possible Issue 3: Network/Linking Issue
1. In Railway, check that services are in the same **"Environment"**
2. Try removing and re-adding the Redis service
3. Make sure internal networking is enabled

## 📋 Quick Checklist
- [ ] Redis service is active in Railway
- [ ] Copied EXACT Redis URL from Redis service variables
- [ ] Updated Backend service with new Redis URL
- [ ] PORT=9000 is set in Backend
- [ ] Redeployed Backend service
- [ ] Checked logs for Redis connection success
- [ ] Tested health endpoints

## 🆘 Last Resort
If nothing works:
1. Delete the Redis service in Railway
2. Add a new Redis service
3. Copy its REDIS_URL to Backend variables
4. Redeploy Backend

The key is ensuring the Redis hostname in REDIS_URL matches what's actually available in your Railway project's internal network.
