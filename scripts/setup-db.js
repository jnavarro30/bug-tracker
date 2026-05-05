import pg from "pg";
import "dotenv/config";

const { Client } = pg;

const DB_USER = process.env.DB_USER || "bugtracker";
const DB_NAME = process.env.DB_NAME || "bugtracker";
const DB_PASSWORD = process.env.DB_PASSWORD || "bugtracker_local";

// Connects via Unix socket — no password needed when run as the postgres OS user.
function adminClient(database = "postgres") {
  return new Client({ database });
}

async function createUserAndDatabase(client) {
  const { rowCount: userExists } = await client.query(
    `SELECT 1 FROM pg_roles WHERE rolname = $1`,
    [DB_USER],
  );
  if (userExists === 0) {
    await client.query(`CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}'`);
    console.log(`  created user: ${DB_USER}`);
  } else {
    console.log(`  user ${DB_USER} already exists, skipping`);
  }

  const { rowCount: dbExists } = await client.query(
    `SELECT 1 FROM pg_database WHERE datname = $1`,
    [DB_NAME],
  );
  if (dbExists === 0) {
    await client.query(`CREATE DATABASE ${DB_NAME} OWNER ${DB_USER}`);
    console.log(`  created database: ${DB_NAME}`);
  } else {
    console.log(`  database ${DB_NAME} already exists, skipping`);
  }
}

async function createSchema(client) {
  await client.query(`
    DROP TABLE IF EXISTS attachments;
    DROP TABLE IF EXISTS comments;
    DROP TABLE IF EXISTS bugs;
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS bugs (
      id          TEXT PRIMARY KEY,
      type        TEXT NOT NULL DEFAULT 'Bug',
      title     TEXT NOT NULL,
      severity    TEXT NOT NULL DEFAULT 'Medium',
      description TEXT,
      platform    TEXT,
      device      TEXT,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS comments (
      id         TEXT PRIMARY KEY,
      bug_id     TEXT REFERENCES bugs(id) ON DELETE CASCADE,
      author     TEXT,
      body       TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS attachments (
      id         TEXT PRIMARY KEY,
      bug_id     TEXT REFERENCES bugs(id) ON DELETE CASCADE,
      name       TEXT,
      media_type TEXT,
      url        TEXT
    );
  `);
  console.log("  schema ready");
}

async function main() {
  console.log("Setting up database...");

  const setup = adminClient("postgres");
  await setup.connect();
  await createUserAndDatabase(setup);
  await setup.end();

  const db = adminClient(DB_NAME);
  await db.connect();
  await createSchema(db);
  await db.end();

  console.log("Done.");
}

main().catch((err) => {
  console.error("Setup failed:", err.message);
  process.exit(1);
});
