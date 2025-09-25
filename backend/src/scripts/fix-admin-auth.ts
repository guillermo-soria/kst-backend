import { ExecArgs } from "@medusajs/framework/types"
import bcrypt from "bcryptjs"

/*
 * fix-admin-auth.ts
 * Intenta (multi-estrategia) garantizar identidad email+password para el admin.
 * Usa ADMIN_EMAIL / ADMIN_PASSWORD. Probar:
 *   ADMIN_EMAIL=admin@kst.local ADMIN_PASSWORD=SuperSecret123 npx medusa exec ./src/scripts/fix-admin-auth.ts
 */
export default async function fixAdminAuth({ container }: ExecArgs) {
  const logger = console
  const email = process.env.ADMIN_EMAIL || "admin@kst.local"
  const password = process.env.ADMIN_PASSWORD || "SuperSecret123"

  // 1. Resolver user service
  const userCandidates = ["userModuleService", "userService", "userModule", "user"]
  let userSvc: any
  for (const k of userCandidates) {
    try { const svc = (container as any).resolve(k); if (svc) { userSvc = svc; logger.log(`[fix-admin-auth] User service: ${k}`); break } } catch {}
  }
  if (!userSvc) { logger.error("[fix-admin-auth] No user service"); return }

  // 2. Obtener/crear usuario admin
  let user: any
  try {
    if (typeof userSvc.listUsers === 'function') {
      const arr = await userSvc.listUsers({ email }, { take: 1 })
      user = arr[0]
    } else if (typeof userSvc.list === 'function') {
      const arr = await userSvc.list({ email }, { take: 1 })
      user = arr[0]
    }
  } catch {}
  if (!user) {
    if (typeof userSvc.createUsers === 'function') {
      const created = await userSvc.createUsers([{ email, first_name: 'Admin', last_name: 'KST', roles: ['admin'] }])
      user = Array.isArray(created) ? created[0] : created
    } else if (typeof userSvc.create === 'function') {
      user = await userSvc.create({ email, first_name: 'Admin', last_name: 'KST', roles: ['admin'] })
    }
    logger.log('[fix-admin-auth] Usuario creado', user?.id)
  } else {
    logger.log('[fix-admin-auth] Usuario existente', user.id)
  }
  if (!user) { logger.error('[fix-admin-auth] No se pudo crear/obtener usuario'); return }

  // 3. Resolver auth service (token 'auth')
  let authSvc: any
  try { authSvc = (container as any).resolve('auth') } catch {}
  if (!authSvc) { logger.error('[fix-admin-auth] No auth service (token auth)'); return }

  // Helper: probar authenticate con diferentes payloads
  const testLogin = async () => {
    const variants: any[] = [
      { email, password },
      { identifier: email, password },
      { email, password, user_id: user.id },
    ]
    for (const body of variants) {
      try {
        const res = await authSvc.authenticate?.('emailpass', body)
        if (res) {
          logger.log('[fix-admin-auth] authenticate success con payload', body)
          return true
        }
      } catch (e:any) {
        logger.log('[fix-admin-auth] authenticate fallo payload', body, '->', e.message)
      }
    }
    return false
  }

  // Si ya autentica, listo
  if (await testLogin()) {
    logger.log('✔ Admin ya autenticable. Email:', email)
    return
  }

  // 4. Intentar register (diferentes firmas)
  const registerAttempts: Array<() => Promise<boolean>> = [
    async () => { await authSvc.register?.('emailpass', { email, password, user_id: user.id }); return true },
    async () => { await authSvc.register?.('emailpass', { email, password, userId: user.id }); return true },
    async () => { await authSvc.register?.('emailpass', { identifier: email, password, user_id: user.id }); return true },
    async () => { await authSvc.register?.('emailpass', { identifier: email, password }); return true },
  ].filter(f => typeof f === 'function')

  for (const attempt of registerAttempts) {
    try { await attempt(); if (await testLogin()) { logger.log('✔ Registro vía register.* OK'); return } } catch (e:any) { logger.log('[fix-admin-auth] register intento fallo:', e.message) }
  }

  // 5. Fallback createAuthIdentities
  if (typeof authSvc.createAuthIdentities === 'function') {
    try {
      const hash = bcrypt.hashSync(password, 10)
      const payloads = [
        { provider: 'emailpass', provider_id: 'emailpass', user_id: user.id, identifier: email, password, hash, password_hash: hash, raw_password: password },
        { provider: 'emailpass', provider_id: 'emailpass', user_id: user.id, identifier: email, password_hash: hash },
      ]
      for (const p of payloads) {
        try {
          await authSvc.createAuthIdentities([p])
          if (await testLogin()) { logger.log('✔ Identidad creada vía createAuthIdentities'); return }
        } catch (e:any) {
          logger.log('[fix-admin-auth] createAuthIdentities payload fallo:', p, '->', e.message)
        }
      }
    } catch (e:any) {
      logger.log('[fix-admin-auth] Fallback createAuthIdentities error:', e.message)
    }
  }

  // 6. Fallback createProviderIdentities (si existe)
  if (typeof authSvc.createProviderIdentities === 'function') {
    try {
      const hash = bcrypt.hashSync(password, 10)
      await authSvc.createProviderIdentities([
        { provider_id: 'emailpass', user_id: user.id, identifier: email, password_hash: hash, hash },
      ])
      if (await testLogin()) { logger.log('✔ Identidad creada vía createProviderIdentities'); return }
    } catch (e:any) {
      logger.log('[fix-admin-auth] createProviderIdentities fallo:', e.message)
    }
  }

  // 7. Si todavía no
  if (!(await testLogin())) {
    logger.error('✖ No se pudo registrar identidad/password. Revisa logs anteriores y estructura real del módulo auth-emailpass.')
  }
}
