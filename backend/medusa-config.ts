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
}

// Opción A: eliminar workflows temporalmente (causaba crash)
const redisModules = useRedis
  ? {
      eventBus: {
        resolve: "@medusajs/event-bus-redis",
        options: { redis: { url: process.env.REDIS_URL } },
      },
      cache: {
        resolve: "@medusajs/cache-redis",
        options: { redis: { url: process.env.REDIS_URL } },
      },
      // workflows removido temporalmente. Para reactivar:
      // workflows: {
      //   resolve: "@medusajs/workflow-engine-redis",
      //   options: { redisUrl: process.env.REDIS_URL }, // probar con redisUrl en vez de objeto nested
      // },
    }
  : {}

const config = {
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    // Ajustá CORS desde env si ya tenés frontend/admin separados
    http: {
      storeCors: parseCors(STORE_CORS_ENV),
      adminCors: parseCors(ADMIN_CORS_ENV),
      authCors: parseCors(AUTH_CORS_ENV),
      // Podés setear HOST/PORT via env si necesitás
      // host: process.env.HOST,
      // port: Number(process.env.PORT) || 9000,
    },
    // Secrets para cookies/JWT en prod
    auth: {
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
      sessionOptions: {
        // en prod, respaldado por redis (evita MemoryStore)
        // si usás @medusajs/cache-redis / session-store via redis, se configura por plugin
      },
    },
  },

  // 🔒 Desactivar servir el Admin embebido por default.
  // Podés reactivarlo seteando DISABLE_MEDUSA_ADMIN=false
  admin: {
    // In Medusa v2, prefer using `serve` to control embedded admin serving
    serve: !boolFromEnv(process.env.DISABLE_MEDUSA_ADMIN, true),
  },

  // Medusa v2 modules (Redis-backed) para estabilidad en producción (condicionales)
  modules: {
    ...redisModules,
  },

  // Si tenés plugins, los mantenés acá (no necesario en v2 para módulos base).
  // plugins: [
  //   { resolve: "@medusajs/auth-emailpass", options: {} },
  // ],
}

export default config
