import { ExecArgs } from "@medusajs/framework/types"

/*
 * inspect-auth.ts
 * Diagnóstico: muestra claves registradas relacionadas a auth/user e intenta descubrir
 * métodos disponibles para el módulo auth (para saber cómo setear password/crear identidad).
 */
export default async function inspectAuth({ container }: ExecArgs) {
  const logger = console

  try {
    const regs = Object.keys((container as any)?.registrations || {})
    const authKeys = regs.filter(k => k.toLowerCase().includes("auth"))
    const userKeys = regs.filter(k => k.toLowerCase().includes("user"))
    logger.log("[inspect-auth] Claves auth registradas:", authKeys)
    logger.log("[inspect-auth] Claves user registradas:", userKeys)

    // Intentar resolver distintas variantes del servicio auth/emailpass
    const candidates = [
      "authEmailPassService",
      "auth_emailpassService",
      "authEmailpassService",
      "authModuleService",
      "authService",
      "auth_moduleService",
      "auth", // visto en tu entorno
    ]
    let resolved: any
    let resolvedKey: string | undefined
    for (const k of candidates) {
      try {
        const svc = (container as any).resolve(k)
        if (svc) { resolved = svc; resolvedKey = k; break }
      } catch { /* ignore */ }
    }

    if (!resolved) {
      logger.warn("[inspect-auth] No se pudo resolver ningún servicio auth de la lista.")
    } else {
      logger.log(`[inspect-auth] Servicio auth resuelto: ${resolvedKey}`)
      try {
        const protoMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(resolved)).filter(m => m !== 'constructor')
        logger.log("[inspect-auth] Métodos en prototype:", protoMethods)
      } catch {}
      try {
        const ownKeys = Object.keys(resolved)
        logger.log("[inspect-auth] Propiedades directas:", ownKeys)
      } catch {}
    }

    // Opcional: listar identidad auth para el usuario admin (si existe) vía remoteQuery
    const email = process.env.ADMIN_EMAIL || "admin@kst.local"
    try {
      const userCandidates = ["userModuleService", "userService", "userModule", "user"]
      let userSvc: any
      for (const k of userCandidates) {
        try { const svc = (container as any).resolve(k); if (svc) { userSvc = svc; break } } catch {}
      }
      let user: any
      if (userSvc) {
        if (typeof userSvc.listUsers === 'function') {
          const existing = await userSvc.listUsers({ email }, { take: 1 })
          user = existing[0]
        } else if (typeof userSvc.list === 'function') {
          const existing = await userSvc.list({ email }, { take: 1 })
          user = existing[0]
        }
      }
      if (user) {
        logger.log(`[inspect-auth] Usuario admin encontrado id=${user.id}`)
        try {
          const remoteQuery: any = (container as any).resolve("remoteQuery")
          const identities = await remoteQuery({ auth_identity: { fields: ["id", "provider_id", "user_id"], filters: { user_id: user.id } } })
          logger.log("[inspect-auth] auth_identity para usuario:", identities)
        } catch (e) {
          logger.warn("[inspect-auth] remoteQuery auth_identity fallo:", (e as Error).message)
        }
      } else {
        logger.log("[inspect-auth] No se encontró usuario admin para email", email)
      }
    } catch (e) {
      logger.warn("[inspect-auth] Sección remoteQuery falló:", (e as Error).message)
    }
  } catch (e) {
    console.error("[inspect-auth] Error general:", e)
  }
}
