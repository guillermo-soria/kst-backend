// Removed defineConfig import and export a plain object config instead to avoid runtime issues
// with defineConfig not being available in the installed Medusa version.

const boolFromEnv = (val?: string, fallback = false) =>
  typeof val === "string" ? val === "true" : fallback

const config = {
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    // Ajustá CORS desde env si ya tenés frontend/admin separados
    http: {
      storeCors: process.env.STORE_CORS,
      adminCors: process.env.ADMIN_CORS,
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

  // Medusa v2 modules (Redis-backed) for production stability
  modules: {
    eventBus: {
      resolve: "@medusajs/event-bus-redis",
      options: { redisUrl: process.env.REDIS_URL },
    },
    cache: {
      resolve: "@medusajs/cache-redis",
      options: { redisUrl: process.env.REDIS_URL },
    },
    workflows: {
      resolve: "@medusajs/workflow-engine-redis",
      options: { redisUrl: process.env.REDIS_URL },
    },
  },

  // Si tenés plugins, los mantenés acá (no necesario en v2 para módulos base).
  // plugins: [
  //   { resolve: "@medusajs/auth-emailpass", options: {} },
  // ],
}

export default config
