/**
 * Crea un usuario admin y le asocia identidad email+password.
 * Ejecuta con:  npx medusa exec scripts/create-admin.mjs
 */
import bcrypt from "bcryptjs"

const EMAIL = process.env.ADMIN_EMAIL || "admin@kst.test"
const PASSWORD = process.env.ADMIN_PASSWORD || "UnaClaveFuerte123"
const FIRST = process.env.ADMIN_FIRST || "Guillermo"
const LAST  = process.env.ADMIN_LAST  || "Soria"

export default async function run({ container, logger }) {
  try {
    // Algunos entornos pasan { container }, otros pasan container suelto:
    const c = container || (global.container ?? null)
    if (!c) {
      console.error("No container received from medusa exec.")
      process.exit(1)
    }

    // Servicios (nombres correctos según el contenedor)
    let userModuleService, authModuleService
    
    try {
      // Usar los nombres correctos que aparecen en el contenedor
      console.log("Intentando resolver servicios...")
      userModuleService = c.resolve("user")
      console.log("Servicio user resuelto:", !!userModuleService)
      
      authModuleService = c.resolve("auth")
      console.log("Servicio auth resuelto:", !!authModuleService)
      
      // Verificar métodos disponibles
      console.log("Métodos del servicio user:", Object.getOwnPropertyNames(Object.getPrototypeOf(userModuleService)))
      
    } catch (error) {
      console.error("Error resolviendo servicios:", error.message)
    }

    if (!userModuleService || !authModuleService) {
      console.error("No se pudieron resolver servicios de usuario/autenticación.")
      console.error("Servicios disponibles en el contenedor:")
      console.error(Object.keys(c.cradle || {}))
      process.exit(1)
    }

    // Ver si ya existe
    const existing = await userModuleService.listUsers({ email: EMAIL })
    if (existing?.length) {
      console.log(`Ya existe un usuario con email ${EMAIL}:`, existing[0].id)
      return
    }

    // 1) Crear el usuario con rol admin
    const [user] = await userModuleService.createUsers([{
      email: EMAIL,
      first_name: FIRST,
      last_name: LAST,
      role: "admin",
    }])

    console.log("Usuario creado:", user.id)

    // 2) Crear identidad email+password para actor "user"
    const hash = await bcrypt.hash(PASSWORD, 10)

    await authModuleService.createAuthIdentities([{
      provider: "emailpass",
      actor_type: "user",     // actor del admin panel
      entity_id: user.id,     // puede llamarse actor_id o entity_id según versión
      actor_id: user.id,      // cubrimos ambos nombres por compatibilidad
      provider_id: EMAIL,     // username/email
      hash,                   // campo para el secreto/clave hasheada
      secret: hash,           // algunas versiones usan 'secret'
    }])

    console.log(`Listo ✅  Admin: ${EMAIL} / ${PASSWORD}`)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}
