const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// FORCE first connection
pool
  .query("SELECT 1")
  .then(() => {
    console.log("Connected to PostgreSQL");
  })
  .catch((err) => {
    console.error("PostgreSQL connection failed:", err);
  });

module.exports = pool;
