require("dotenv").config();
const { query, getPool } = require("../db");

async function ensureColumn(table, column, sqlType) {
  // NOTE: some SHOW/ALTER statements do not accept parameter binding for identifiers in all drivers.
  // Use a safe literal here for the LIKE pattern (table and column are trusted values in this script).
  const exists = await query(`SHOW COLUMNS FROM \`${table}\` LIKE '${column}'`);
  if (!exists || exists.length === 0) {
    console.log(`Adding column ${column} to ${table}...`);
    await query(`ALTER TABLE ${table} ADD COLUMN ${column} ${sqlType}`);
    return true;
  }

  // If column exists, ensure it has the right definition (e.g., DATETIME DEFAULT ...)
  // We will attempt to modify the column to the requested type (idempotent if already correct).
  try {
    console.log(
      `Ensuring column ${column} on ${table} has expected type (${sqlType})`
    );
    await query(`ALTER TABLE ${table} MODIFY COLUMN ${column} ${sqlType}`);
  } catch (err) {
    console.warn(`Could not modify ${table}.${column}:`, err.message);
  }
  return false;
}

async function backfillTable(table) {
  console.log(`Processing ${table}...`);
  // ensure columns exist
  await ensureColumn(table, "createdAt", "DATETIME DEFAULT CURRENT_TIMESTAMP");
  await ensureColumn(
    table,
    "updatedAt",
    "DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
  );

  // Backfill any nulls to NOW()
  const res1 = await query(
    `UPDATE ${table} SET createdAt = NOW() WHERE createdAt IS NULL`
  );
  const res2 = await query(
    `UPDATE ${table} SET updatedAt = NOW() WHERE updatedAt IS NULL`
  );
  console.log(
    `${table}: set createdAt null -> NOW() updated ${res1.affectedRows} rows`
  );
  console.log(
    `${table}: set updatedAt null -> NOW() updated ${res2.affectedRows} rows`
  );
}

async function run() {
  const pool = await getPool();
  try {
    await backfillTable("Posts");
    await backfillTable("Reports");
    console.log("Backfill complete.");
    process.exit(0);
  } catch (err) {
    console.error("Backfill failed:", err.message || err);
    process.exit(1);
  } finally {
    try {
      pool.end();
    } catch (e) {}
  }
}

if (require.main === module) run();

module.exports = { backfillTable, run };
