const dotenv = require("dotenv");

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || process.env.MYSQLHOST || "localhost",
  port: Number(process.env.DB_PORT || process.env.MYSQLPORT || 3306),
  user: process.env.DB_USER || process.env.MYSQLUSER || "root",
  password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || "",
  database:
    process.env.DB_NAME || process.env.MYSQLDATABASE || "user_document_submissions",
  socketPath: process.env.DB_SOCKET || "",
};

const isProduction = process.env.NODE_ENV === "production";

const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  frontendUrl: isProduction
    ? process.env.FRONTEND_URL
    : process.env.FRONTEND_URL || "http://localhost:3000",
  dbConfig,
  uploadDir: process.env.UPLOAD_DIR || "uploads",
  maxUploadSize: Number(process.env.MAX_UPLOAD_SIZE_BYTES || 5242880),
};

module.exports = env;
