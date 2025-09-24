# 🚀 Railway Deployment Checklist

## Pre-deployment Checklist
- [x] Health checks passing locally
- [x] Railway configuration files created
- [x] Environment variables documented
- [x] Database migrations ready
- [x] Production secrets prepared

## Railway Setup Steps

### 1. Create Railway Account & Project
1. Go to [railway.app](https://railway.app)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository: `kst-backend`
6. Set **Build Path**: `backend` (important!)
7. Railway will detect Node.js and start initial build

### 2. Add PostgreSQL Database
1. In Railway dashboard, click "+ New"
2. Select "Database" → "PostgreSQL" 
3. Wait for database to provision (~2-3 minutes)
4. Database connection will be automatically available as `DATABASE_URL`

### 3. Configure Environment Variables
In Railway Project → Settings → Environment Variables, add:

**Required Variables (copy from .env.railway):**
```
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-change-this-now
COOKIE_SECRET=your-super-secret-cookie-key-min-32-chars-change-this
MEDUSA_WORKER_MODE=shared
DISABLE_MEDUSA_ADMIN=false
```

**CORS Variables (update domains when ready):**
```
STORE_CORS=http://localhost:3000
ADMIN_CORS=${{RAILWAY_STATIC_URL}}
AUTH_CORS=${{RAILWAY_STATIC_URL}}
```

### 4. Deploy & Monitor
1. Railway will automatically deploy after environment setup
2. Monitor build logs for any issues
3. First deployment may take 5-10 minutes
4. Check deployment logs for migration success

### 5. Post-deployment Verification

#### Test Health Endpoint
```bash
curl https://your-app.railway.app/health
```

#### Access Admin Panel
```
https://your-app.railway.app/app
```

#### Create Admin User
```bash
# Option 1: Via Railway terminal
npx @medusajs/medusa-cli@latest user create

# Option 2: Via API (use tools like Postman/curl)
POST https://your-app.railway.app/admin/users
{
  "email": "admin@yourdomain.com", 
  "password": "secure-password"
}
```

## Optional Enhancements

### Add Redis (Recommended)
1. Click "+ New" → "Database" → "Redis"
2. Redis URL automatically available as `REDIS_URL`
3. Improves performance for caching and events

### Custom Domain
1. Railway Settings → Domains
2. Add your custom domain
3. Update CORS variables accordingly

## Troubleshooting

### Common Issues
- **Build fails**: Check Node version, ensure `backend` folder selected
- **Database errors**: Verify `DATABASE_URL` is set automatically  
- **CORS errors**: Update CORS environment variables
- **Admin access**: Ensure `DISABLE_MEDUSA_ADMIN=false`

### Useful Commands
```bash
# Check Railway logs
railway logs

# Connect to Railway database
railway connect Postgres

# Run migrations manually if needed
railway run npm run migrate
```

## Next Steps After Deployment
- [ ] Test all endpoints
- [ ] Create admin user
- [ ] Verify database migrations
- [ ] Update frontend to connect to production API
- [ ] Move to Epic 2: Mercado Pago integration

---
✅ **Ready for Railway deployment!**
