import { ExecArgs } from "@medusajs/framework/types"

/*
 * Seed mínimo idempotente:
 * - Crea sólo un producto demo si no existe (handle: remera-demo-kst)
 *
 * Ejecutar:
 *   npx medusa exec ./src/scripts/seed.ts
 * o npm run seed
 */

export default async function seed({ container }: ExecArgs) {
  const logger = console
  try {
    const productModule: any = container.resolve("product")

    const handle = "remera-demo-kst"
    const [products, count] = await productModule.listAndCountProducts({ handle })

    if (count > 0) {
      logger.log(`Producto demo ya existe (handle=${handle}) - no se crea otro.`)
      return
    }

    await productModule.createProducts([
      {
        title: "Remera Demo KST",
        handle,
        description: "Producto demo inicial para pruebas de la plataforma KST.",
        status: "published",
      },
    ])

    logger.log("✔ Producto demo creado correctamente")
  } catch (e) {
    console.error("Error en seed mínimo:", e)
  }
}
