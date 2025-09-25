// Removed defineConfig import and export a plain object config instead to avoid runtime issues
// with defineConfig not being available in the installed Medusa version.

const boolFromEnv = (val?: string, fallback = false) =>
  typeof val === "string" ? val === "true" : fallback

// Helper para parsear listas de CORS: "a,b,c" -> ["a","b","c"]
const parseCors = (value?: string) => {
  if (!value) return undefined
  const parts = value.split(",").map((p) => p.trim()).filter(Boolean)
  return parts.length > 1 ? parts : parts[0]
}

// Normalizar variables de entorno (acepta variantes MEDUSA_*)
const STORE_CORS_ENV = process.env.STORE_CORS || process.env.MEDUSA_STORE_CORS
const ADMIN_CORS_ENV = process.env.ADMIN_CORS || process.env.MEDUSA_ADMIN_CORS
const AUTH_CORS_ENV = process.env.AUTH_CORS || process.env.MEDUSA_AUTH_CORS

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
const adminServe = forceEnableAdmin && !disableAdminFlag
console.log(
  "[medusa-config] admin.serve=", adminServe,
  "FORCE_ENABLE_ADMIN=", process.env.FORCE_ENABLE_ADMIN,
  "DISABLE_MEDUSA_ADMIN=", process.env.DISABLE_MEDUSA_ADMIN
)

const config = {
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL, // requerido por EventBus redis
    // Ajustá CORS desde env si ya tenés frontend/admin separados
    http: {
      storeCors: parseCors(STORE_CORS_ENV),
      adminCors: parseCors(ADMIN_CORS_ENV),
      authCors: parseCors(AUTH_CORS_ENV),
      // host / port opcional
    },
    auth: {
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
      sessionOptions: {},
    },
  },
  admin: {
    serve: adminServe,
  },
  modules: {
    ...redisModules,
  },
  // plugins: []
}

export default config
