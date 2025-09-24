// medusa-config.ts
import { loadEnv, defineConfig } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

const isProduction = process.env.NODE_ENV === "production"
const hasRedis = Boolean(process.env.REDIS_URL)

export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    // opcional: muchas partes ya toman Redis desde modules abajo
    redisUrl: process.env.REDIS_URL,

    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET!,
      cookieSecret: process.env.COOKIE_SECRET!,
    },

    ...(isProduction && {
      workerMode:
        (process.env.MEDUSA_WORKER_MODE as "shared" | "worker" | "server") ||
        "shared",
    }),
  },

  admin: {
    disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
  },

  // ⚠️ En v2 conviene declarar los módulos como objeto (no arreglo)
  modules: {
    // Event Bus
    eventBus: hasRedis
      ? {
          resolve: "@medusajs/event-bus-redis",
          options: { redisUrl: process.env.REDIS_URL },
        }
      : {
          // fallback dev
          resolve: "@medusajs/medusa/event-bus-local",
          options: {},
        },

    // Cache
    cache: hasRedis
      ? {
          resolve: "@medusajs/cache-redis",
          options: { redisUrl: process.env.REDIS_URL },
        }
      : {
          // fallback dev
          resolve: "@medusajs/medusa/cache-inmemory",
          options: {},
        },

    // Workflows (recomendado Redis en prod)
    ...(hasRedis
      ? {
          workflows: {
            resolve: "@medusajs/workflow-engine-redis",
            options: { redisUrl: process.env.REDIS_URL },
          },
        }
      : {}),
  },
})
