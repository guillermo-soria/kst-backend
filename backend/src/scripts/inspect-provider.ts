import { ExecArgs } from "@medusajs/framework/types"

/*
 * inspect-provider.ts
 * Muestra métodos del provider emailpass para decidir cómo crear / actualizar la contraseña.
 */
export default async function inspectProvider({ container }: ExecArgs) {
  const logger = console
  try {
    const authSvc: any = (container as any).resolve('auth')
    if (!authSvc) { logger.error('[inspect-provider] auth service no encontrado (token auth)'); return }
    const provider = authSvc.getAuthIdentityProviderService?.('emailpass')
    if (!provider) { logger.error('[inspect-provider] Provider emailpass no encontrado'); return }
    const protoMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(provider)).filter(m => m !== 'constructor')
    logger.log('[inspect-provider] Métodos provider emailpass:', protoMethods)
    try { logger.log('[inspect-provider] Propiedades directas:', Object.keys(provider)) } catch {}
  } catch (e) {
    console.error('[inspect-provider] Error:', e)
  }
}
