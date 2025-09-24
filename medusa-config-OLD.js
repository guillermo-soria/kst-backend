require("dotenv").config();

module.exports = {
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      port: Number(process.env.PORT) || 9001,
      storeCors: process.env.MEDUSA_STORE_CORS || "http://localhost:3000",
      adminCors: process.env.MEDUSA_ADMIN_CORS || "http://localhost:7001",
      authCors: process.env.MEDUSA_ADMIN_CORS || "http://localhost:7001",
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  }
};
