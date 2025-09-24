import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

const isProduction = process.env.NODE_ENV === 'production'

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
    // Production-specific settings
    ...(isProduction && {
      workerMode: (process.env.MEDUSA_WORKER_MODE as "shared" | "worker" | "server") || 'shared'
    })
  },
  admin: {
    disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
  },
  modules: [
    {
      resolve: "@medusajs/medusa/cache-inmemory",
      options: {
        // Use Redis in production if available, fallback to in-memory
        ...(process.env.REDIS_URL && { 
          redisUrl: process.env.REDIS_URL 
        })
      }
    },
    {
      resolve: "@medusajs/medusa/event-bus-local",
      options: {
        // Use Redis event bus in production if available
        ...(process.env.REDIS_URL && { 
          redisUrl: process.env.REDIS_URL 
        })
      }
    }
  ]
})
