import { ExecArgs } from "@medusajs/framework/types"

/*
 * Script: create-pk.ts
 * Crea (idempotente) una Publishable API Key para el storefront.
 * Uso:
 *  npm run pk:create --workspace=backend            (usa titulo "Storefront")
 *  PK_TITLE="Mi Front" npm run pk:create --workspace=backend
 */
export default async function createPk({ container }: ExecArgs) {
  const logger = console
  const title = process.env.PK_TITLE || "Storefront"

  // Detectar servicio de publishable keys
  const svcCandidates = [
    "publishableApiKeyService",
    "publishable_api_keyService",
    "publishableKeyService",
  ]
  let pkSvc: any | undefined
  for (const k of svcCandidates) {
    try {
      const maybe = (container as any).resolve(k)
      if (maybe) {
        pkSvc = maybe
        logger.log(`[create-pk] Usando servicio: ${k}`)
        break
      }
    } catch { /* noop */ }
  }
  if (!pkSvc) {
    logger.error("[create-pk] No se pudo resolver el servicio de Publishable API Keys.")
    return
  }

  try {
    // Intentar listar existentes por título
    let existing: any[] = []
    try {
      if (typeof pkSvc.list === "function") {
        existing = await pkSvc.list({ title }, { take: 1 })
      } else if (typeof pkSvc.listAndCount === "function") {
        const [res] = await pkSvc.listAndCount({ title }, { take: 1 })
        existing = res
      }
    } catch { /* ignore */ }

    if (existing && existing.length) {
      const pk = existing[0]
      logger.log(`[create-pk] Ya existe key con title='${title}'. ID=${pk.id}`)
      // Mostrar valor/token si está presente (depende de la implementación)
      if (pk.token || pk.value) {
        logger.log(`[create-pk] token/value: ${pk.token || pk.value}`)
      }
      return
    }

    // Crear
    let created: any
    if (typeof pkSvc.create === "function") {
      created = await pkSvc.create({ title })
    } else if (typeof pkSvc.createPublishableApiKey === "function") {
      created = await pkSvc.createPublishableApiKey({ title })
    } else {
      logger.error("[create-pk] El servicio no expone método create*. Abortando.")
      return
    }

    const pkObj = Array.isArray(created) ? created[0] : created
    logger.log("✔ Publishable API Key creada:", {
      id: pkObj?.id,
      title: pkObj?.title,
      token: pkObj?.token || pkObj?.value,
    })

    // Intentar asociar al primer sales channel (opcional)
    try {
      const scSvc = (container as any).resolve("salesChannelService")
      if (scSvc) {
        let scList: any[] = []
        if (typeof scSvc.list === "function") {
          scList = await scSvc.list({}, { take: 1 })
        } else if (typeof scSvc.listAndCount === "function") {
          const [res] = await scSvc.listAndCount({}, { take: 1 })
          scList = res
        }
        const sc = scList[0]
        if (sc && typeof pkSvc.addSalesChannels === "function") {
          await pkSvc.addSalesChannels(pkObj.id, [sc.id])
          logger.log(`[create-pk] Asociado al sales channel ${sc.id}`)
        }
      }
    } catch (e) {
      logger.warn("[create-pk] Asociación a sales channel falló (no crítico):", (e as Error).message)
    }
  } catch (e) {
    logger.error("[create-pk] Error:", e)
  }
}
