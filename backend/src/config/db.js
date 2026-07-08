const mysql = require("mysql2/promise");
const env = require("./env");

const pool = mysql.createPool({
  ...(env.dbSocket
    ? { socketPath: env.dbSocket }
    : {
        host: env.dbHost,
        port: Number(env.dbPort),
      }),
  user: env.dbUser,
  password: env.dbPassword,
  database: env.dbName,
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
