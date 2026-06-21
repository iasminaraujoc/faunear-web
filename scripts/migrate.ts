import path from "node:path";

import { createDatabase } from "../src/database/connection.js";
import { runMigrations } from "../src/database/migrate.js";

const databasePath = path.join(
  process.cwd(),
  "database",
  "faunear.sqlite",
);

console.log("Iniciando migration...");
console.log(`Diretório atual: ${process.cwd()}`);
console.log(`Banco de dados: ${databasePath}`);

const database = createDatabase(databasePath);

try {
  runMigrations(database);

  console.log("Banco de dados atualizado com sucesso.");
} catch (error) {
  console.error("Erro ao executar as migrations:");
  console.error(error);

  process.exitCode = 1;
} finally {
  database.close();
}