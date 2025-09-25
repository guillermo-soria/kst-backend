import { medusaIntegrationTestRunner } from "@medusajs/test-utils"

jest.setTimeout(60 * 1000)

medusaIntegrationTestRunner({
  inApp: true,
  env: {
    DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgres://postgres:postgres@localhost:5433/postgres'
  },
  testSuite: ({ api }) => {
    describe("Products Listing (Store API)", () => {
      it("lists store products (at least demo if seeded)", async () => {
        const res = await api.get("/store/products")
        expect(res.status).toBe(200)
        const data = res.data.products || res.data.data || []
        expect(Array.isArray(data)).toBe(true)
      })
    })
  },
})
