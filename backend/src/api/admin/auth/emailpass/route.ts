import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

/*
 * Endpoint manual de login admin email+password porque el provider no expone ruta automática.
 * URL: POST /admin/auth/emailpass { email, password }
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { email, password } = req.body as { email?: string; password?: string }
  if (!email || !password) {
    return res.status(400).json({ message: "email y password requeridos" })
  }
  try {
    const auth: any = req.scope.resolve("auth")
    // Intentos de authenticate con distintas variantes
    const attempts = [
      () => auth.authenticate?.("emailpass", { email, password }),
      () => auth.authenticate?.("emailpass", { identifier: email, password }),
      () => auth.authenticate?.("emailpass", { email, identifier: email, password }),
    ]
    let result: any
    for (const fn of attempts) {
      try { result = await fn(); if (result) break } catch { /* try next */ }
    }
    if (!result) {
      return res.status(401).json({ message: "Unauthorized" })
    }
    // result puede incluir auth_identity; generar JWT manual simple
    const jwt = require('jsonwebtoken')
    const token = jwt.sign({ sub: email, scope: 'admin' }, process.env.JWT_SECRET || 'dev', { expiresIn: '1h' })
    return res.json({ token, user: { email } })
  } catch (e: any) {
    return res.status(500).json({ message: e.message })
  }
}

export const AUTHENTICATE = false
