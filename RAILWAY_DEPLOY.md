# Railway Deployment Guide

## Prerequisites
1. Railway account: [railway.app](https://railway.app)
2. GitHub repository with this code
3. PostgreSQL database (will be created in Railway)

## Step-by-Step Deployment

### 1. Create Railway Project
1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Select the `backend` folder as the root directory

### 2. Add PostgreSQL Database
1. In your Railway project dashboard
2. Click "New" → "Database" → "PostgreSQL"
3. Wait for the database to be provisioned
4. The `DATABASE_URL` environment variable will be automatically set

### 3. Configure Environment Variables
In Railway project settings → Variables, add:

```bash
# Required
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-this
COOKIE_SECRET=your-super-secret-cookie-key-change-this

# CORS - Update with your actual domains
STORE_CORS=https://your-frontend-domain.pages.dev
ADMIN_CORS=https://your-backend-domain.railway.app
AUTH_CORS=https://your-backend-domain.railway.app

# Optional but recommended
MEDUSA_WORKER_MODE=shared
DISABLE_MEDUSA_ADMIN=false
```

### 4. Optional: Add Redis
1. Click "New" → "Database" → "Redis"
2. The `REDIS_URL` will be automatically set
3. This improves performance for caching and events

### 5. Deploy
1. Railway will automatically build and deploy
2. Monitor the build logs for any issues
3. Once deployed, you'll get a domain like: `https://your-app.railway.app`

### 6. Run Database Migrations
After first deployment:
1. Go to Railway project → Deployments
2. Open the deployment logs
3. Verify migrations ran successfully
4. If not, you can trigger them manually in the Railway terminal

### 7. Create Admin User
Option 1 - Via Railway terminal:
```bash
npx @medusajs/medusa-cli@latest user create --email admin@yourdomain.com --password your-password
```

Option 2 - Via API endpoint after deployment:
```bash
curl -X POST https://your-app.railway.app/admin/users \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@yourdomain.com","password":"your-password"}'
```

### 8. Test the Deployment
1. Health check: `https://your-app.railway.app/store/health`
2. Admin health: `https://your-app.railway.app/admin/health`
3. Admin panel: `https://your-app.railway.app/app`
4. API docs: `https://your-app.railway.app/docs`

## Production Checklist
- [ ] Database provisioned and connected
- [ ] Environment variables set (especially secrets!)
- [ ] CORS domains updated for production
- [ ] Admin user created
- [ ] Health checks responding
- [ ] Redis added (optional but recommended)
- [ ] Domain configured (optional)
- [ ] Monitoring set up (Epic 6)

## Common Issues
1. **Build fails**: Check Node.js version in Railway matches your local version
2. **Database connection**: Ensure DATABASE_URL is set automatically by Railway
3. **CORS errors**: Update STORE_CORS, ADMIN_CORS, AUTH_CORS with correct domains
4. **Admin access**: Ensure DISABLE_MEDUSA_ADMIN=false and admin user is created

## Next Steps
After successful deployment:
- Configure custom domain (Optional)
- Set up monitoring and logging
- Move to Epic 2: Mercado Pago integration
