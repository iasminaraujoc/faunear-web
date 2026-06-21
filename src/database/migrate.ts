import fs from "node:fs";
import path from "node:path";
import type { AppDatabase } from "./connection.js";

interface AppliedMigrationRow {
  filename: string;
}

export function runMigrations(database: AppDatabase): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename TEXT PRIMARY KEY,
      executed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const migrationDirectory = path.join(
    process.cwd(),
    "database",
    "migrations",
  );

  const migrationFiles = fs
    .readdirSync(migrationDirectory)
    .filter((filename) => filename.endsWith(".sql"))
    .sort();

  const appliedRows = database
    .prepare("SELECT filename FROM schema_migrations")
    .all() as AppliedMigrationRow[];

  const appliedMigrations = new Set(
    appliedRows.map((row) => row.filename),
  );

  const applyMigration = database.transaction(
    (filename: string, sql: string) => {
      database.exec(sql);

      database
        .prepare(
          "INSERT INTO schema_migrations (filename) VALUES (?)",
        )
        .run(filename);
    },
  );

  for (const filename of migrationFiles) {
    if (appliedMigrations.has(filename)) {
      continue;
    }

    const migrationPath = path.join(
      migrationDirectory,
      filename,
    );

    const sql = fs.readFileSync(migrationPath, "utf8");

    applyMigration(filename, sql);

    console.log(`Migration executada: ${filename}`);
  }
}