import path from "path"
import fs from "fs"
import express from "express"

// Loader para servir el build del legacy admin (@medusajs/admin 7.x) manualmente.
// Evita depender de la lógica interna del plugin (que puede no montar en Medusa 2.x).
// Activa sólo si ENABLE_LEGACY_ADMIN=true y existe el build.
//
// Variables soportadas:
//   ENABLE_LEGACY_ADMIN=true        -> habilita el loader
//   LEGACY_ADMIN_PATH=/legacy-admin -> cambia la ruta pública (default /legacy-admin)
//
// Acceso final: http://host:port/legacy-admin
// (index.html + assets del build en node_modules/@medusajs/admin/build)
export default async function legacyAdminLoader({ container }: any) {
  if (process.env.ENABLE_LEGACY_ADMIN !== "true") return

  const app = container.resolve("app")
  const buildDir = path.join(process.cwd(), "node_modules", "@medusajs", "admin", "build")
  if (!fs.existsSync(buildDir)) {
    console.warn("[legacy-admin-loader] build no encontrado:", buildDir)
    console.warn("[legacy-admin-loader] Asegura que @medusajs/admin haya generado su build (instalación correcta).")
    return
  }

  const mountPath = (process.env.LEGACY_ADMIN_PATH || "/legacy-admin").replace(/\/$/, "")
  // Servir estáticos
  app.use(mountPath, express.static(buildDir))
  // Fallback SPA (cualquier subruta devuelve index.html)
  app.get(`${mountPath}/*`, (_req: any, res: any) => {
    res.sendFile(path.join(buildDir, "index.html"))
  })

  console.log(`[legacy-admin-loader] Legacy admin servido en ${mountPath} desde ${buildDir}`)
  console.log(`[legacy-admin-loader] Si deseas desactivar, quita ENABLE_LEGACY_ADMIN o elimina este loader.`)
}
