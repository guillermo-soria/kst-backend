import { defineConfig } from "@medusajs/medusa"

const boolFromEnv = (val?: string, fallback = false) =>
  typeof val === "string" ? val === "true" : fallback

export default defineConfig({
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
    disable: boolFromEnv(process.env.DISABLE_MEDUSA_ADMIN, true),
    // En versiones que usan 'serve': false, podrías usar:
    // serve: !boolFromEnv(process.env.DISABLE_MEDUSA_ADMIN, true)
  },

  // Si tenés plugins, los mantenés acá.
  // plugins: [
  //   { resolve: "@medusajs/auth-emailpass", options: {} },
  //   { resolve: "@medusajs/cache-redis", options: { redisUrl: process.env.REDIS_URL } },
  //   { resolve: "@medusajs/event-bus-redis", options: { redisUrl: process.env.REDIS_URL } },
  //   { resolve: "@medusajs/workflow-engine-redis", options: { redisUrl: process.env.REDIS_URL } },
  // ],
})
