/**
 * Uses node-pg directly so bad credentials show up immediately.
 * Medusa/Knex can surface the same failure as KnexTimeoutError after ~60s.
 */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") })

const { Client } = require("pg")

const url = process.env.DATABASE_URL
if (!url) {
  console.error("DATABASE_URL is missing. Copy .env.template to .env and set DATABASE_URL.")
  process.exit(1)
}

const c = new Client({
  connectionString: url,
  connectionTimeoutMillis: 8000,
})

c.connect()
  .then(() => c.query("SELECT 1 AS ok"))
  .then((res) => {
    console.log("Database OK:", res.rows[0])
    return c.end()
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message)
    console.error(
      "Update DATABASE_URL in .env (user, password, host, port, database). On Windows, use the password you set for the postgres user during PostgreSQL installation."
    )
    process.exit(1)
  })
