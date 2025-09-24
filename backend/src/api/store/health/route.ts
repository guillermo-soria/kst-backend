import { 
  MedusaRequest, 
  MedusaResponse
} from "@medusajs/framework/http"

export const GET = (req: MedusaRequest, res: MedusaResponse) => {
  // Basic health check - no authentication required
  return res.status(200).json({
    status: "ok",
    message: "KST Backend is healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    version: process.env.npm_package_version || "unknown"
  })
}

// Disable authentication for health check
export const AUTHENTICATE = false
