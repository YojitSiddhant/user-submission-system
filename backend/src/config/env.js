const dotenv = require("dotenv");

dotenv.config();

const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  dbHost: process.env.DB_HOST || "localhost",
  dbPort: process.env.DB_PORT || "3306",
  dbSocket: process.env.DB_SOCKET || "",
  dbUser: process.env.DB_USER || "root",
  dbPassword: process.env.DB_PASSWORD || "",
  dbName: process.env.DB_NAME || "user_document_submissions",
  uploadDir: process.env.UPLOAD_DIR || "uploads",
  maxUploadSize: Number(process.env.MAX_UPLOAD_SIZE_BYTES || 5242880),
};

module.exports = env;
