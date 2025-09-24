/**
 * Script alternativo para crear usuario admin usando Remote Query API
 */
import bcrypt from "bcryptjs"

const EMAIL = process.env.ADMIN_EMAIL || "admin@kst.test"
const PASSWORD = process.env.ADMIN_PASSWORD || "UnaClaveFuerte123"
const FIRST = process.env.ADMIN_FIRST || "Guillermo"
const LAST = process.env.ADMIN_LAST || "Soria"

export default async function run({ container, logger }) {
  try {
    console.log("🚀 Iniciando creación de usuario admin...")
    console.log(`📧 Email: ${EMAIL}`)
    
    const c = container

    // Usar RemoteQuery que sabemos que funciona
    const query = c.resolve("query")
    const remoteLink = c.resolve("remoteLink")
    
    if (!query) {
      console.error("❌ No se pudo resolver el servicio query")
      process.exit(1)
    }
    
    console.log("✅ Servicio query disponible")
    
    // En MedusaJS v2, podemos usar workflows para crear usuarios
    const workflows = c.resolve("workflows")
    console.log("Workflows disponible:", !!workflows)
    
    // Intentar acceso directo a la conexión de base de datos
    const pgConnection = c.resolve("__pg_connection__")
    if (pgConnection) {
      console.log("✅ Conexión directa a la BD disponible")
      
      // Hash de la contraseña
      const hash = await bcrypt.hash(PASSWORD, 10)
      
      try {
        // Verificar si el usuario ya existe
        const existingResult = await pgConnection.raw(`
          SELECT id FROM "user" WHERE email = ?
        `, [EMAIL])
        
        if (existingResult.rows?.length > 0) {
          console.log(`✅ Ya existe un usuario con email ${EMAIL}:`, existingResult.rows[0].id)
          return
        }
        
        // Crear usuario directamente en la BD
        const userResult = await pgConnection.raw(`
          INSERT INTO "user" (email, first_name, last_name, role, created_at, updated_at)
          VALUES (?, ?, ?, 'admin', NOW(), NOW())
          RETURNING id
        `, [EMAIL, FIRST, LAST])
        
        const userId = userResult.rows[0].id
        console.log("✅ Usuario creado con ID:", userId)
        
        // Crear identidad de autenticación
        await pgConnection.raw(`
          INSERT INTO auth_identity (provider_id, actor_type, entity_id, provider, auth_data, created_at, updated_at)
          VALUES (?, 'user', ?, 'emailpass', ?, NOW(), NOW())
        `, [EMAIL, userId, JSON.stringify({ password: hash })])
        
        console.log(`🎉 Listo! Admin creado: ${EMAIL} / ${PASSWORD}`)
        
      } catch (dbError) {
        console.error("❌ Error de base de datos:", dbError.message)
        console.log("ℹ️  Esto puede ser normal si las tablas no existen aún.")
        console.log("ℹ️  Intenta ejecutar 'npm run migrate' primero.")
      }
    } else {
      console.log("❌ No hay acceso directo a la BD")
    }

  } catch (error) {
    console.error("❌ Error general:", error.message)
    console.error(error.stack)
  }
}
