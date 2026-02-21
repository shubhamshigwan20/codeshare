const { Client } = require("pg");
require("dotenv").config();

const db = new Client({
  host: process.env.PGHOST,
  port: 5432,
  username: process.env.PGUSER,
  database: process.env.PGDATABASE,
});

module.exports = db;
