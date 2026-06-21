import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

export type AppDatabase = InstanceType<typeof Database>;

export function createDatabase(
  databasePath = process.env.DATABASE_PATH ??
    path.join(process.cwd(), "database", "faunear.sqlite"),
): AppDatabase {
  fs.mkdirSync(path.dirname(databasePath), {
    recursive: true,
  });

  const database = new Database(databasePath);

  database.pragma("foreign_keys = ON");
  database.pragma("journal_mode = WAL");

  return database;
}