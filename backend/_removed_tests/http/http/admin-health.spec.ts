import { medusaIntegrationTestRunner } from "@medusajs/test-utils"

jest.setTimeout(60 * 1000)

medusaIntegrationTestRunner({
  inApp: true,
  env: {
    DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgres://postgres:postgres@localhost:5433/postgres'
  },
  testSuite: ({ api }) => {
    describe("Admin Health", () => {
      it("returns admin health payload", async () => {
        const res = await api.get("/admin/health")
        expect(res.status).toBe(200)
        expect(res.data.status).toBe("ok")
        expect(res.data.panel).toBe("custom-external-v2")
      })
    })
  },
})
