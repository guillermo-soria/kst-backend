import { 
  MedusaRequest, 
  MedusaResponse
} from "@medusajs/framework/http"

export const GET = (req: MedusaRequest, res: MedusaResponse) => {
  return res.json({
    status: "ok",
    message: "KST Admin API is healthy", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    version: process.env.npm_package_version || "unknown",
    panel: "custom-external-v2"
  })
}
