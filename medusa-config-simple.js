require("dotenv").config();

module.exports = {
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    
    http: {
      port: Number(process.env.PORT) || 9000,
      authMethodsPerActor: {
        user: ["emailpass"],
        customer: ["emailpass"],
      },
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },

    storeCors: process.env.MEDUSA_STORE_CORS,
    adminCors: process.env.MEDUSA_ADMIN_CORS,
  },

  plugins: [],
};
