# Variables de Entorno para Railway

## Variables OBLIGATORIAS para que funcione:

```bash
# Secretos de seguridad (OBLIGATORIOS)
JWT_SECRET=kst-super-secret-jwt-key-2024-change-this-in-production
COOKIE_SECRET=kst-super-secret-cookie-key-2024-change-this-in-production

# Entorno
NODE_ENV=production

# CORS (usando tu dominio real de Railway)
STORE_CORS=https://medusa-starter-default-production-ec61.up.railway.app
ADMIN_CORS=https://medusa-starter-default-production-ec61.up.railway.app
AUTH_CORS=https://medusa-starter-default-production-ec61.up.railway.app

# Base de datos (copiar desde PostgreSQL)
DATABASE_URL=postgresql://postgres:xbStCVxwGoWTwPPLJWpBjyPSJISiGeTK@postgres.railway.internal:5432/railway
```

## Cómo agregar en Railway:

1. Ve a tu proyecto en Railway
2. Click en Settings → Variables  
3. Agrega cada variable una por una
4. Click "Save" después de cada una
5. Haz redeploy

## Verificar que DATABASE_URL existe:
- Debe aparecer automáticamente cuando agregues PostgreSQL
- Si no aparece, el problema es que no tienes la base de datos

## IMPORTANTE:
- Cambia los secretos JWT_SECRET y COOKIE_SECRET por valores únicos
- Actualiza los dominios CORS con tus URLs reales de Railway y Cloudflare

## ¿Cómo encontrar tu dominio de Railway?

1. **Ve a tu proyecto en Railway**
2. **Click en tu servicio backend** (no en PostgreSQL)
3. **Ve a la pestaña "Settings"**
4. **Busca la sección "Domains"** - ahí verás algo como:
   ```
   https://web-production-1a2b.up.railway.app
   ```
5. **Copia esa URL** y úsala para las variables CORS

## Configuración RÁPIDA (copia y pega):

**PASO 1:** Busca tu dominio de Railway (ejemplo: `web-production-1a2b.up.railway.app`)

**PASO 2:** Ve a Settings → Variables y agrega estas variables una por una:

```bash
NODE_ENV=production
JWT_SECRET=kst-super-secret-jwt-2024-change-me
COOKIE_SECRET=kst-super-cookie-secret-2024-change-me
STORE_CORS=https://medusa-starter-default-production-ec61.up.railway.app
ADMIN_CORS=https://medusa-starter-default-production-ec61.up.railway.app
AUTH_CORS=https://medusa-starter-default-production-ec61.up.railway.app
```

**PASO 3:** Reemplaza `TU-DOMINIO-RAILWAY` con tu dominio real

**PASO 4:** Haz redeploy
