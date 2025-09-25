import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import jwt from "jsonwebtoken"

jest.setTimeout(60 * 1000)

// Variables para el test (se pueden sobreescribir via env del runner si se desea)
const ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL || "admin@example.com"
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD || "admin"

medusaIntegrationTestRunner({
  inApp: true,
  env: {
    // Base DB "postgres" siempre existe; el runner creará DBs temporales a partir de ella
    DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgres://postgres:postgres@localhost:5433/postgres',
    JWT_SECRET: process.env.JWT_SECRET || "test-secret",
  },
  testSuite: ({ api }) => {
    describe("Admin Auth EmailPass", () => {
      it("should login with email+password and return a valid JWT", async () => {
        // Intentar login directo (suponiendo que el usuario ya existe por seed/fix script)
        const res = await api.post("/admin/auth/emailpass", {
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
        })
        expect(res.status).toBe(200)
        expect(res.data.token).toBeDefined()
        const decoded: any = jwt.decode(res.data.token)
        expect(decoded).toBeTruthy()
        expect(decoded.sub).toBe(ADMIN_EMAIL)
        expect(decoded.scope).toBe("admin")
      })

      it("should fail with wrong password", async () => {
        const res = await api.post("/admin/auth/emailpass", {
          email: ADMIN_EMAIL,
          password: "wrong-password",
        })
        expect(res.status).toBe(401)
      })

      it("should fail missing fields", async () => {
        const res = await api.post("/admin/auth/emailpass", {})
        expect(res.status).toBe(400)
      })
    })
  },
})
