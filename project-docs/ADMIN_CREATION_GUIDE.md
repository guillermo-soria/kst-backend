# 🔧 CREAR USUARIO ADMIN - GUÍA RAILWAY DASHBOARD

## 🎯 MÉTODO RECOMENDADO: Railway Dashboard Query

Ya que las conexiones locales fallan, usa Railway Dashboard:

### Paso 1: Acceder a Railway Database
1. Ve a **Railway Dashboard**
2. Click en tu **PostgreSQL service** 
3. Ve a **"Query"** tab
4. Aquí puedes ejecutar SQL directamente

### Paso 2: Ejecutar Query de Creación Admin

**Copia y pega este SQL:**

```sql
-- Crear usuario admin para Medusa (HASH REAL GENERADO)
INSERT INTO "user" (
  id,
  email, 
  first_name,
  last_name,
  password_hash,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'admin@kst.com',
  'KST',
  'Admin', 
  '$2b$12$U3jhum7AL4oyhQqSh.760.AJtxuKc4DO7sOV/oZykT/D0vRA04WhO',
  NOW(),
  NOW()
) 
ON CONFLICT (email) DO NOTHING;
```

### Paso 3: Hash de Password

**Problema**: Necesitamos generar el hash correcto de la password.

**Solución temporal**: Usar hash MD5 simple (solo para testing):

```sql
-- VERSIÓN SIMPLE (para desarrollo)
INSERT INTO "user" (
  id,
  email, 
  first_name,
  last_name,
  password_hash,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'admin@kst.com',
  'KST',
  'Admin', 
  md5('KST2025@Admin' || 'salt'),
  NOW(),
  NOW()
) 
ON CONFLICT (email) DO NOTHING;
```

## 🔍 PASO 0: VERIFICAR ESTRUCTURA DE TABLA

**¡IMPORTANTE!** Primero necesitamos ver qué columnas tiene realmente la tabla `user`:

### En Railway Dashboard:
1. Ve a tu **PostgreSQL service**
2. Busca la tabla **`user`** (o **`users`**)
3. **Mira las columnas disponibles**

### Posibles nombres de columnas para password:
- `password_hash`
- `password`
- `hashed_password`
- `password_encrypted`

### Otras estructuras posibles en Medusa v2:
- **Tabla separada**: `auth_user` o `admin_user`
- **Tabla de autenticación**: `auth_identity`
- **Sistema modular**: `auth_provider`

## 🎯 ALTERNATIVAS SEGÚN LA ESTRUCTURA:

### Si la tabla `user` NO tiene columna de password:
```sql
-- Solo crear el perfil básico
INSERT INTO "user" (
  id,
  email, 
  first_name,
  last_name,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'admin@kst.com',
  'KST',
  'Admin',
  NOW(),
  NOW()
);
```

### Si hay tabla `auth_identity` o similar:
```sql
-- Crear en tabla de autenticación
INSERT INTO "auth_identity" (
  id,
  provider_identity_id,
  provider,
  user_data,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'admin@kst.com',
  'emailpass',
  '{"email": "admin@kst.com", "password_hash": "$2b$12$U3jhum7AL4oyhQqSh.760.AJtxuKc4DO7sOV/oZykT/D0vRA04WhO"}',
  NOW(),
  NOW()
);
```

## 🎯 ALTERNATIVA MÁS FÁCIL

### Método Admin Panel Direct Access

1. **Accede a**: https://medusa-starter-default-production-ec61.up.railway.app/admin

2. **Si ves pantalla de login**: Medusa podría tener un usuario por defecto

3. **Si ves "Setup" o "Welcome"**: Sigue el wizard para crear primer admin

4. **Si requiere invitación**: Necesitamos crear el admin via DB

## 🚀 DESPUÉS DE CREAR ADMIN

**Credenciales:**
- Email: `admin@kst.com`
- Password: `KST2025@Admin`

**Login URL:** https://medusa-starter-default-production-ec61.up.railway.app/admin

## 📋 SIGUIENTE PASO

Una vez que tengas acceso admin:
1. **Configurar Store**: regions, currencies, shipping
2. **Deploy Frontend**: conectar al backend funcional  
3. **Testing E2E**: verificar flujo completo

**¿Puedes probar acceder al admin panel primero para ver qué tipo de pantalla aparece?**

# Admin User Creation Guide for Medusa v2

## 🎯 FINAL STEP: Complete Admin User Creation

### Status: Ready to Complete
We have successfully created the `auth_identity` record with ID `authid_new_admin_001`. Now we need to create the corresponding `provider_identity` record to complete the admin user setup.

### Step 1: Complete the Admin Creation on Railway

**Option A: Run on Railway Terminal**
```bash
# SSH into your Railway deployment or use Railway CLI
railway shell

# Navigate to backend directory
cd backend

# Run the completion script
node scripts/complete-admin-creation-railway.js
```

**Option B: Deploy the Script**
The `complete-admin-creation-railway.js` script is ready and can be run on Railway where the `DATABASE_URL` environment variable is available.

### Step 2: Verify Admin Setup

After running the completion script, verify everything is working:

```bash
# On Railway
node scripts/verify-admin-complete.js
```

This will check:
- ✅ `auth_identity` record exists (`authid_new_admin_001`)
- ✅ `provider_identity` record exists and references the auth_identity
- ✅ Both records are properly linked
- ✅ Admin credentials are ready

### Step 3: Test Admin Login

Once both records are created, you can log in to the Medusa admin panel:

**Credentials:**
- **Email:** `admin@kst.test`
- **Password:** `KST2025@Admin`

**Admin URL:**
- Your Railway backend URL + `/admin`
- Example: `https://your-backend.up.railway.app/admin`

### Database Schema Summary

The admin user requires TWO database records:

1. **auth_identity** (✅ CREATED)
   ```sql
   INSERT INTO auth_identity (
     id,                     -- 'authid_new_admin_001'
     app_metadata,           -- {"user_id": "user_new_admin_001"}
     user_metadata,          -- {}
     provider_identities,    -- ["provid_xxx"]
     created_at,
     updated_at
   )
   ```

2. **provider_identity** (🔄 TO BE CREATED)
   ```sql
   INSERT INTO provider_identity (
     id,                     -- 'provid_xxx'
     entity_id,              -- 'user_new_admin_001'
     provider,               -- 'emailpass'
     auth_identity_id,       -- 'authid_new_admin_001'
     provider_metadata,      -- {"email": "admin@kst.test", "password_hash": "..."}
     created_at,
     updated_at
   )
   ```

### Scripts Available

1. **`complete-admin-creation-railway.js`** - Creates the `provider_identity` record
2. **`verify-admin-complete.js`** - Verifies both records exist and are linked
3. **`create-admin-v2.mjs`** - Creates the initial `auth_identity` record (already done)

### Next Steps After Completion

1. ✅ Verify admin login works
2. ✅ Test creating products and other admin functions
3. ✅ Document the final admin credentials securely
4. ✅ Update frontend to connect to the admin API if needed

---
