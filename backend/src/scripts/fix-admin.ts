import { ExecArgs } from "@medusajs/framework/types"

/*
 * fix-admin.ts
 * Garantiza un usuario admin con identidad email+password funcional.
 * Usa vars opcionales ADMIN_EMAIL / ADMIN_PASSWORD.
 */
export default async function fixAdmin({ container }: ExecArgs) {
  const logger = console
  const email = process.env.ADMIN_EMAIL || "admin@kst.local"
  const password = process.env.ADMIN_PASSWORD || "SuperSecret123"

  // Descubrir servicio de usuarios (distintos tokens posibles según setup / versión)
  const userCandidates = [
    "userModuleService",
    "userService",
    "userModule",
    "user", // en ciertos casos se registra así
  ]
  let userSvc: any
  for (const k of userCandidates) {
    try {
      const svc = (container as any).resolve(k)
      if (svc) { userSvc = svc; logger.log(`[fix-admin] User service: ${k}`); break }
    } catch { /* ignore */ }
  }
  if (!userSvc) {
    // Loguear claves disponibles para debug
    try {
      const keys = Object.keys((container as any)?.registrations || {})
        .filter(k => k.toLowerCase().includes("user"))
      logger.warn("[fix-admin] No se resolvió servicio de usuario. Claves candidatas detectadas:", keys)
    } catch {}
    logger.error("[fix-admin] Abortando: no se encontró un servicio de usuarios (revisa módulo @medusajs/user en medusa-config).")
    return
  }

  // Detectar servicio auth email+pass (ampliamos candidatos)
  const authCandidates = [
    "authEmailPassService",
    "auth_emailpassService",
    "authEmailpassService",
    "authModuleService",
    "authService",
    "auth_moduleService",
  ]
  let authSvc: any
  for (const k of authCandidates) {
    try {
      const s = (container as any).resolve(k)
      if (s) { authSvc = s; logger.log(`[fix-admin] Auth service: ${k}`); break }
    } catch {}
  }
  if (!authSvc) {
    try {
      const keys = Object.keys((container as any)?.registrations || {})
        .filter(k => k.toLowerCase().includes("auth"))
      logger.warn("[fix-admin] No se resolvió servicio de auth. Claves que contienen 'auth':", keys)
    } catch {}
    logger.error("[fix-admin] No se encontró authEmailPass/authModule service. Revisa módulo @medusajs/auth y provider @medusajs/auth-emailpass en medusa-config.")
    return
  }

  // Buscar usuario existente
  let user: any | undefined
  try {
    if (typeof userSvc.listUsers === "function") {
      const existing = await userSvc.listUsers({ email }, { take: 1, relations: ["auth_identities"] })
      user = existing[0]
    } else if (typeof userSvc.list === "function") {
      const existing = await userSvc.list({ email }, { take: 1 })
      user = existing[0]
    } else if (typeof userSvc.retrieve === "function") {
      // algunos servicios permiten retrieve por email si configurado
      try { user = await userSvc.retrieve({ email }) } catch {}
    }
  } catch (e) {
    logger.warn("[fix-admin] list/listUsers fallo", (e as Error).message)
  }

  if (user) {
    try {
      if (typeof authSvc.setPassword === "function") {
        await authSvc.setPassword({ userId: user.id, email, password })
      } else {
        logger.warn("[fix-admin] authSvc no expone setPassword; intentando continuar sin reset.")
        logger.warn("[fix-admin] Métodos authSvc:", Object.getOwnPropertyNames(Object.getPrototypeOf(authSvc)))
        logger.log("[fix-admin] Admin existente sin poder cambiar password automáticamente.")
        return
      }
      logger.log("[fix-admin] Password actualizado para admin existente.")
      logger.log("✔ Admin listo. Email:", email, "Password:", password)
      return
    } catch (e) {
      logger.warn("[fix-admin] setPassword fallo, intentando recrear usuario…", (e as Error).message)
      try {
        if (typeof userSvc.deleteUsers === "function") {
          await userSvc.deleteUsers([user.id])
        } else if (typeof userSvc.delete === "function") {
          await userSvc.delete(user.id)
        } else {
          logger.error("[fix-admin] No hay método delete/deleteUsers en el servicio de usuarios.")
          return
        }
        logger.log("[fix-admin] Usuario anterior eliminado.")
      } catch (delErr) {
        logger.error("[fix-admin] No se pudo eliminar el usuario existente.", delErr)
        return
      }
    }
  }

  // Crear nuevo usuario
  let newUser: any
  try {
    if (typeof userSvc.createUsers === "function") {
      const createdArr = await userSvc.createUsers([
        { email, first_name: "Admin", last_name: "KST", roles: ["admin"] },
      ])
      newUser = Array.isArray(createdArr) ? createdArr[0] : createdArr
    } else if (typeof userSvc.create === "function") {
      newUser = await userSvc.create({ email, first_name: "Admin", last_name: "KST", roles: ["admin"] })
    } else {
      logger.error("[fix-admin] Servicio de usuarios no expone create/createUsers.")
      return
    }
    logger.log("[fix-admin] Usuario admin creado:", newUser.id)
  } catch (e) {
    logger.error("[fix-admin] Error creando usuario", e)
    return
  }

  // Set password
  try {
    if (typeof authSvc.setPassword === "function") {
      await authSvc.setPassword({ userId: newUser.id, email, password })
      logger.log("[fix-admin] Password seteado correctamente.")
      logger.log("✔ Admin listo. Email:", email, "Password:", password)
    } else {
      logger.warn("[fix-admin] authSvc no tiene setPassword; revisa provider emailpass. Métodos:", Object.getOwnPropertyNames(Object.getPrototypeOf(authSvc)))
    }
  } catch (e) {
    logger.error("[fix-admin] Error seteando password", e)
  }
}
