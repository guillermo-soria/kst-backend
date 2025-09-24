# KST E-commerce Platform

A modern e-commerce platform built with MedusaJS v2 backend and Next.js frontend, designed for scalability and performance.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Development Setup
```bash
# Install dependencies
npm install

# Start both backend and frontend in development
npm run dev

# Or run individually
npm run dev:backend    # MedusaJS on :9000
npm run dev:frontend   # Next.js on :3000
```

### Environment Setup
Copy environment files and configure:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Update database and other settings in `.env` files.

## 🏗️ Architecture

- **Backend**: MedusaJS v2 with PostgreSQL
- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS  
- **Payments**: Mercado Pago integration (Epic 2)
- **Deployment**: Railway (backend) + Cloudflare Pages (frontend)
- **Storage**: Cloudflare R2 (Epic 5)

## Project Structure

### Mono-repo Setup
```
kst-backend/
├── backend/           # MedusaJS v2 API ✅
├── frontend/          # Next.js storefront ✅
├── scripts/           # Utility scripts ✅
├── .github/           # CI/CD templates ✅
├── RAILWAY_DEPLOY.md  # Deployment guide ✅
└── PROGRESS.md        # Development tracking
```

## 🔧 Available Scripts

### Root Level (Mono-repo)
```bash
npm run dev            # Start both servers
npm run build          # Build both applications  
npm run test           # Run all tests
npm run lint           # Lint all code
npm run clean          # Clean all node_modules
```

### Individual Services
```bash
npm run dev:backend    # MedusaJS development server
npm run dev:frontend   # Next.js development server
npm run build:backend  # Build backend for production
npm run build:frontend # Build frontend for production
```

## 🌐 Development URLs

### Backend (MedusaJS)
- **Health Check**: http://localhost:9000/health
- **Admin Panel**: http://localhost:9000/app
- **API Docs**: http://localhost:9000/docs
- **Store API**: http://localhost:9000/store

### Frontend (Next.js)
- **Store**: http://localhost:3000
- **Built with**: App Router + TypeScript

## 📋 Development Roadmap

### ✅ Completed
- **Epic 0**: Repository structure and mono-repo setup
- **Epic 1**: Backend deployment preparation (Railway ready)

### 🚧 Current Focus  
- **Epic 3**: Frontend development (Homepage & store básico)
- **Epic 2**: Mercado Pago payment integration (después)

### 📅 Upcoming
- **Epic 3**: Frontend store development and Cloudflare deployment
- **Epic 4**: Custom domain and CDN configuration
- **Epic 5**: R2 storage and media optimization
- **Epic 6**: Monitoring, logging, and production readiness

## 🚀 Deployment

### Backend (Railway) - Ready ✅
Follow the detailed guide: [RAILWAY_DEPLOY.md](RAILWAY_DEPLOY.md)

```bash
# Validate deployment readiness
node scripts/health-check.js
```

### Frontend (Cloudflare Pages) - Planned
Coming in Epic 3 with full store integration.

## 📊 Database

PostgreSQL with MedusaJS v2 schema:
```sql
CREATE DATABASE medusa_v2;
-- Migrations run automatically on deployment
```

## 🔐 Environment Variables

### Backend (.env)
```bash
DATABASE_URL=postgres://...
JWT_SECRET=your-secret-change-this
COOKIE_SECRET=your-secret-change-this
STORE_CORS=http://localhost:3000
ADMIN_CORS=http://localhost:9000
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
```

## 🔍 Health Monitoring

```bash
# Backend health check
curl http://localhost:9000/health

# Automated validation
node scripts/health-check.js
```

## 📈 Progress Tracking

See [PROGRESS.md](PROGRESS.md) for detailed development status and next steps.

---

Built with ❤️ for KST Store | Ready for Railway Deployment
