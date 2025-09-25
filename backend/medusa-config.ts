// Removed defineConfig import and export a plain object config instead to avoid runtime issues
// with defineConfig not being available in the installed Medusa version.

// If running under jest ensure NODE_ENV is test early
if (process.env.JEST_WORKER_ID !== undefined || process.env.TEST_TYPE) {
  if (!process.env.NODE_ENV) process.env.NODE_ENV = 'test'
}

// --- TEST DB FALLBACK / NORMALIZATION ---
if (process.env.NODE_ENV === "test") {
  // Permitir que los tests pasen TEST_DATABASE_URL si el runner la setea
  if (!process.env.DATABASE_URL && process.env.TEST_DATABASE_URL) {
    process.env.DATABASE_URL = process.env.TEST_DATABASE_URL
  }
  // Fallback alternativo MEDUSA_DATABASE_URL
  if (!process.env.DATABASE_URL && process.env.MEDUSA_DATABASE_URL) {
    process.env.DATABASE_URL = process.env.MEDUSA_DATABASE_URL
  }
  // Forzar 127.0.0.1 para evitar resolver a un socket/local instance diferente
  if (process.env.DATABASE_URL?.includes('localhost')) {
    process.env.DATABASE_URL = process.env.DATABASE_URL.replace('localhost', '127.0.0.1')
  }
}

const boolFromEnv = (val?: string, fallback = false) =>
  typeof val === "string" ? val === "true" : fallback

// Helper para parsear listas de CORS: ahora devolvemos siempre el string original
// porque Medusa internamente hace str.split(',') y fallaba si le dábamos un array.
const parseCors = (value?: string) => value

// Normalizar variables de entorno (acepta variantes MEDUSA_*)
const STORE_CORS_ENV = process.env.STORE_CORS || process.env.MEDUSA_STORE_CORS
const ADMIN_CORS_ENV = process.env.ADMIN_CORS || process.env.MEDUSA_ADMIN_CORS
const AUTH_CORS_ENV = process.env.AUTH_CORS || process.env.MEDUSA_AUTH_CORS

// --- Log seguro de la DB seleccionada ---
try {
  if (process.env.DATABASE_URL) {
    const dbUrl = new URL(process.env.DATABASE_URL)
    const sanitized = `${dbUrl.protocol}//${dbUrl.username ? dbUrl.username + '@' : ''}${dbUrl.host}${dbUrl.pathname}`
    console.log('[medusa-config] Using databaseUrl =', sanitized, 'NODE_ENV=', process.env.NODE_ENV)
  } else {
    console.log('[medusa-config] No DATABASE_URL provided at load time')
  }
} catch (e) {
  console.log('[medusa-config] DATABASE_URL present but not parseable')
}

const useRedis = !!process.env.REDIS_URL
if (!useRedis) {
  // Mostrar advertencia sólo en producción para no ensuciar dev si no se usa redis
  if (process.env.NODE_ENV === "production") {
    console.warn("[medusa-config] REDIS_URL no definido. Desactivando módulos Redis (eventBus/cache)")
  }
} else if (process.env.NODE_ENV === "production") {
  // Log seguro (no exponer password) para confirmar que la var llegó al runtime.
  try {
    const u = new URL(process.env.REDIS_URL as string)
    if (u.password) u.password = "***"
    console.log("[medusa-config] REDIS_URL detectada ->", `${u.protocol}//${u.username ? u.username + '@' : ''}${u.host}${u.pathname}`)
  } catch {
    console.log("[medusa-config] REDIS_URL presente pero no parseable")
  }
}

// Opción A: eliminar workflows temporalmente (causaba crash)
const redisModules = useRedis
  ? {
      eventBus: {
        resolve: "@medusajs/event-bus-redis",
        // Medusa v2 espera `redisUrl` plano en options
        options: { redisUrl: process.env.REDIS_URL },
      },
      cache: {
        resolve: "@medusajs/cache-redis",
        // Igual que arriba: usar redisUrl directo (el error mostraba que no lo encontraba)
        options: { redisUrl: process.env.REDIS_URL },
      },
      // workflows removido temporalmente. Para reactivar:
      // workflows: {
      //   resolve: "@medusajs/workflow-engine-redis",
      //   options: { redisUrl: process.env.REDIS_URL },
      // },
    }
  : {}

// ---------------- Admin embebido ----------------
// Forzamos desactivado por defecto para evitar crash si no existe build.
// Se puede reactivar seteando FORCE_ENABLE_ADMIN=true y proveyendo build.
const forceEnableAdmin = boolFromEnv(process.env.FORCE_ENABLE_ADMIN, false)
const disableAdminFlag = boolFromEnv(process.env.DISABLE_MEDUSA_ADMIN, true) // default true
// Nuevo: en desarrollo servir admin salvo que se deshabilite explícitamente
const autoDevAdmin = process.env.NODE_ENV !== "production" && !disableAdminFlag
const adminServe = (autoDevAdmin || forceEnableAdmin) && !disableAdminFlag
console.log(
  "[medusa-config] admin.serve=", adminServe,
  "NODE_ENV=", process.env.NODE_ENV,
  "autoDevAdmin=", autoDevAdmin,
  "FORCE_ENABLE_ADMIN=", process.env.FORCE_ENABLE_ADMIN,
  "DISABLE_MEDUSA_ADMIN=", process.env.DISABLE_MEDUSA_ADMIN
)
// Añadimos propiedad disable explícita (algunas versiones la usan en vez de serve)
const adminDisable = !adminServe

// Si estamos en modo SQLite test añadimos databaseType + driverOptions
const wantSqlite = process.env.NODE_ENV === 'test' && (process.env.USE_SQLITE_TEST === 'true' || process.env.TEST_USE_SQLITE === 'true')
if (wantSqlite) {
  // Generar filename temporal distinto por proceso para evitar colisiones
  const rand = Math.random().toString(36).slice(2, 8)
  const sqliteFile = `/tmp/medusa-test-${rand}.sqlite`
  // Limpiar vars de Postgres para que el driver de Medusa no intente usarlas
  delete process.env.DATABASE_URL
  ;(global as any).__MEDUSA_TEST_SQLITE__ = sqliteFile
  console.log('[medusa-config] Using SQLite test DB at', sqliteFile)
}

const config = {
  projectConfig: {
    databaseUrl: wantSqlite ? undefined : process.env.DATABASE_URL,
    // Si estamos en modo SQLite test añadimos databaseType + driverOptions
    ...(global as any).__MEDUSA_TEST_SQLITE__ ? {
      databaseType: 'sqlite',
      databaseDriverOptions: {
        connection: { filename: (global as any).__MEDUSA_TEST_SQLITE__ }
      }
    } : {},
    redisUrl: process.env.REDIS_URL, // requerido por EventBus redis
    // Ajustá CORS desde env si ya tenés frontend/admin separados
    http: {
      storeCors: parseCors(STORE_CORS_ENV),
      adminCors: parseCors(ADMIN_CORS_ENV),
      authCors: parseCors(AUTH_CORS_ENV),
    },
    auth: {
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
      sessionOptions: {},
    },
  },
  admin: {
    serve: adminServe, // usado por versiones recientes
    disable: adminDisable, // fallback para versiones que miran 'disable'
  },
  modules: {
    // Auth + Users
    user: {
      resolve: "@medusajs/user",
      options: {
        jwtSecret: process.env.USER_JWT_SECRET || process.env.JWT_SECRET,
        jwt_secret: process.env.USER_JWT_SECRET || process.env.JWT_SECRET, // alias requerido
      },
    },
    auth: {
      resolve: "@medusajs/auth",
      options: {
        jwtSecret: process.env.AUTH_JWT_SECRET || process.env.JWT_SECRET,
        jwt_secret: process.env.AUTH_JWT_SECRET || process.env.JWT_SECRET,
        providers: [
          {
            resolve: "@medusajs/auth-emailpass",
            id: "emailpass",
            options: {},
          },
        ],
      },
    },
    // Módulo de productos (requerido para seed y endpoints de productos)
    product: { resolve: "@medusajs/product" },
    ...redisModules,
  },
  plugins: [],
}

export default config
