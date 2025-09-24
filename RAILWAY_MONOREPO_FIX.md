# 🔧 Railway Monorepo Configuration Fix

## 🚨 PROBLEMA IDENTIFICADO: Estructura Monorepo Conflictiva

**Problema actual:**
- Railway está deployando desde: `/kst-backend/` (raíz)
- Pero Medusa está en: `/kst-backend/backend/`
- Dos `package.json` están confundiendo el build process

**Error resultante:**
- Railway no encuentra los scripts correctos
- Redis URL no se resuelve porque está en el contexto equivocado
- Medusa config no se carga desde la ubicación correcta

## ✅ SOLUCIÓN INMEDIATA

### Método 1: Configurar Root Directory en Railway (RECOMENDADO)

#### Paso 1: Configurar Root Directory
1. Ve a Railway Dashboard → Tu Backend Service
2. Ve a **"Settings"** tab
3. Busca **"Root Directory"** o **"Source"**
4. Configura: `backend` (sin slash inicial)
5. Guarda los cambios

#### Paso 2: Verificar Build Command
En Railway Settings, asegúrate que:
- **Build Command**: `npm run build` (o déjalo vacío para auto-detección)
- **Start Command**: `npm run railway:start`

#### Paso 3: Redeploy
1. Click "Deploy" en Railway
2. Railway ahora usará `/backend/` como directorio raíz
3. Usará `/backend/package.json` y `/backend/medusa-config.ts`

### Método 2: Si No Puedes Configurar Root Directory

#### Opción 2A: Mover Medusa a la Raíz
```bash
# En tu máquina local:
cd /Users/guillermosoriacorrea/kst-backend
mv backend/* .
mv backend/.[^.]* . 2>/dev/null || true
rmdir backend
```

#### Opción 2B: Crear package.json Proxy en Raíz
```json
{
  "name": "kst-backend-railway",
  "scripts": {
    "build": "cd backend && npm run build",
    "start": "cd backend && npm run railway:start",
    "railway:start": "cd backend && npm run railway:start"
  },
  "dependencies": {},
  "engines": {
    "node": ">=18.0.0"
  }
}
```

## 🎯 PRUEBA RÁPIDA

Para confirmar que este es el problema:

1. **Revisa los logs de Railway Build**
2. Busca líneas como:
   ```
   ❌ npm run railway:start
   ❌ script not found
   ❌ Cannot find module 'medusa-config'
   ```

Si ves esos errores, confirma que Railway está en el directorio equivocado.

## 📋 Checklist Post-Fix

Después de aplicar la solución:

- [ ] Railway build usa `/backend/package.json`
- [ ] Railway encuentra `medusa-config.ts`
- [ ] Scripts `railway:start` funcionan
- [ ] Variables de entorno se cargan correctamente
- [ ] Redis se conecta (porque ahora está en el contexto correcto)

## 🚀 RESULTADO ESPERADO

Una vez corregido, los logs deberían mostrar:
```
✅ Using /backend as root directory
✅ Found package.json with railway:start script
✅ Loading medusa-config.ts
✅ Redis connection successful
```
