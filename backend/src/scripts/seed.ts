import { ExecArgs } from "@medusajs/framework/types"

/*
 * Seed mínimo idempotente (v2 compatible):
 * - Detecta dinámicamente el servicio/módulo de productos.
 * - Crea un producto demo si no existe.
 */

export default async function seed({ container }: ExecArgs) {
  const logger = console
  const handle = "remera-demo-kst"

  // Mostrar claves registradas relacionadas a producto para debug
  try {
    const registrationKeys = Object.keys((container as any)?.registrations || {})
    const productKeys = registrationKeys.filter((k) => k.toLowerCase().includes("product"))
    logger.log("[seed] Claves relacionadas a producto detectadas:", productKeys)
  } catch { /* noop */ }

  // Intentar distintas claves de registro (según framework / módulo)
  const candidates = [
    "productModuleService",
    "productService",
    "productModule",
    "product", // intento previo
  ]

  let productSvc: any | undefined
  for (const key of candidates) {
    try {
      const svc = (container as any).resolve(key)
      if (svc) {
        productSvc = svc
        logger.log(`[seed] Usando servicio de producto: ${key}`)
        break
      }
    } catch { /* ignore */ }
  }

  let exists = false
  try {
    if (productSvc) {
      if (typeof productSvc.listAndCountProducts === "function") {
        const [_l, c] = await productSvc.listAndCountProducts({ handle })
        exists = c > 0
      } else if (typeof productSvc.listAndCount === "function") {
        const [_l, c] = await productSvc.listAndCount({ handle })
        exists = c > 0
      }
    }

    if (!exists) {
      // Fallback remoteQuery para existencia
      try {
        const remoteQuery: any = (container as any).resolve("remoteQuery")
        const result = await remoteQuery({ product: { fields: ["id", "handle"], filters: { handle } } })
        const arr = Array.isArray(result) ? result : result?.product || []
        exists = arr.length > 0
        if (exists) logger.log("[seed] Producto encontrado vía remoteQuery.")
      } catch (e) {
        logger.warn("[seed] remoteQuery fallback falló:", e)
      }
    }

    if (exists) {
      logger.log(`Producto demo ya existe (handle=${handle}) - ok.`)
      return
    }

    if (!productSvc) {
      logger.error("[seed] No se pudo resolver un servicio de productos. Abortando creación. Revisa claves logueadas arriba. Si ninguna sirve, puede requerirse el módulo workflows para create.*")
      return
    }

    // Creación
    if (typeof productSvc.createProducts === "function") {
      await productSvc.createProducts([
        { title: "Remera Demo KST", handle, description: "Producto demo inicial para pruebas de la plataforma KST.", status: "published" },
      ])
    } else if (typeof productSvc.create === "function") {
      await productSvc.create({ title: "Remera Demo KST", handle, description: "Producto demo inicial para pruebas de la plataforma KST.", status: "published" })
    } else {
      logger.error("[seed] Servicio de productos no expone método create/createProducts. Posible falta de workflows o module service correcto.")
      return
    }

    logger.log("✔ Producto demo creado correctamente")
  } catch (e) {
    console.error("Error en seed mínimo:", e)
  }
}
