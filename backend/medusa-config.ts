// medusa-config.ts
import { loadEnv, defineConfig } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

const isProduction = process.env.NODE_ENV === "production"
const hasRedis = Boolean(process.env.REDIS_URL)

export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL, // opcional
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET!,      // evita "supersecret" en prod
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

  // módulos en objeto (v2)
  modules: {
    // EVENT BUS → Redis cuando hay REDIS_URL
    eventBus: hasRedis
      ? {
          resolve: "@medusajs/event-bus-redis",
          options: { redisUrl: process.env.REDIS_URL },
        }
      : {
          resolve: "@medusajs/medusa/event-bus-local",
          options: {},
        },

    // CACHE → Redis cuando hay REDIS_URL
    cache: hasRedis
      ? {
          resolve: "@medusajs/cache-redis",
          options: { redisUrl: process.env.REDIS_URL },
        }
      : {
          resolve: "@medusajs/medusa/cache-inmemory",
          options: {},
        },

    // WORKFLOWS → Solo configurar si Redis está disponible, sino omitir completamente
    ...(hasRedis && {
      workflows: {
        resolve: "@medusajs/workflow-engine-redis",
        options: {
          redis: {
            url: process.env.REDIS_URL,
          },
        },
      },
    }),

    // AUTH → Configuración del módulo de autenticación
    auth: {
      resolve: "@medusajs/auth",
      options: {
        providers: [
          {
            resolve: "@medusajs/auth-emailpass",
            id: "emailpass",
            options: {},
          },
        ],
      },
    },
  },
})
