# 🔧 Railway Deployment Troubleshooting

## 🚨 CURRENT CRITICAL ISSUE (2024-12-20 02:20)

### **REDIS CONNECTION FAILURE**

**Error**:
```
Error: getaddrinfo ENOTFOUND redis-g6xi.railway.internal
Cannot destructure property 'url' of 'redisConnectionUrl' as it is undefined
```

**Root Cause**:
1. ❌ Incorrect Redis URL format in environment variables
2. ❌ Missing `PORT=9000` variable
3. ❌ Redis service not properly linked to backend

**SOLUTION**:

#### **Step 1: Get Correct Redis URL**
1. Go to Railway → Redis Service → Variables
2. Copy the EXACT `REDIS_URL` value (should look like):
   ```
   redis://default:[long-password]@[internal-host].railway.internal:6379
   ```

#### **Step 2: Update Backend Variables**
1. Go to Railway → Backend Service → Variables
2. Update/Add these variables:
   ```bash
   REDIS_URL=[paste-exact-value-from-redis-service]
   PORT=9000
   ```

#### **Step 3: Redeploy**
1. Click "Redeploy" in backend service
2. Monitor logs for successful connection

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
