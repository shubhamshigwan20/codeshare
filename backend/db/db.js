const { Pool } = require("pg");
require("dotenv").config();

const sslRequired = process.env.PGSSLMODE === "require";

const db = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT || 5432),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  ssl: sslRequired ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

db.on("error", (err) => {
  console.error("Unexpected PostgreSQL pool error:", err);
});

module.exports = db;
