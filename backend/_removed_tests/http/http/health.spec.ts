import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
jest.setTimeout(60 * 1000)

medusaIntegrationTestRunner({
  inApp: true,
  env: {
    // Usar la DB base "postgres" (existe por defecto en el contenedor) para que el runner cree DBs efímeras
    DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgres://postgres:postgres@localhost:5433/postgres'
  },
  testSuite: ({ api }) => {
    describe("Ping", () => {
      it("ping the server health endpoint", async () => {
        const response = await api.get('/health')
        expect(response.status).toEqual(200)
      })
    })
  },
})