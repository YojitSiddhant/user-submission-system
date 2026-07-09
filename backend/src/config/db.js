const mysql = require("mysql2/promise");
const env = require("./env");

const pool = mysql.createPool({
  ...(env.dbConfig.socketPath
    ? { socketPath: env.dbConfig.socketPath }
    : {
        host: env.dbConfig.host,
        port: env.dbConfig.port,
      }),
  user: env.dbConfig.user,
  password: env.dbConfig.password,
  database: env.dbConfig.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4",
});

async function verifyDatabaseConnection() {
  const connection = await pool.getConnection();
  try {
    await connection.ping();
  } finally {
    connection.release();
  }
}

module.exports = {
  pool,
  verifyDatabaseConnection,
};
