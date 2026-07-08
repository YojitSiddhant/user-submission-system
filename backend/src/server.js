const app = require("./app");
const env = require("./config/env");
const { verifyDatabaseConnection } = require("./config/db");

async function startServer() {
  try {
    await verifyDatabaseConnection();

    app.listen(env.port, () => {
      // The API is ready only after the database responds successfully.
      console.log(`API server running on port ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start API server:", error.message);
    process.exit(1);
  }
}

startServer();
