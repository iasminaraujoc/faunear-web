import path from "node:path";

import { createDatabase } from "../src/database/connection.js";
import { SpeciesRepository } from "../src/database/species-repository.js";
import { runMigrations } from "../src/database/migrate.js";

const databasePath = path.join(process.cwd(), "database", "faunear.sqlite");
const database = createDatabase(databasePath);

try {
  runMigrations(database);

  const repository = new SpeciesRepository(database);
  const items = repository.findByFilters({});

  if (items.length === 0) {
    repository.create({
      commonName: "Mico-Leão-Dourado",
      scientificName: "Leontopithecus rosalia",
      location: "Rio de Janeiro",
      threats: "Perda de habitat e fragmentação florestal",
      conservationStatus: "Criticamente em perigo",
      populationTrend: "Decrescente",
      description: "Primata endêmico da Mata Atlântica, conhecido por sua pelagem dourada e forte dependência de florestas densas.",
      category: "Mamífero",
      imagePath: null,
    });

    repository.create({
      commonName: "Arara-Azul",
      scientificName: "Anodorhynchus hyacinthinus",
      location: "São Paulo",
      threats: "Tráfico de animais e perda de habitat",
      conservationStatus: "Em perigo",
      populationTrend: "Estável",
      description: "Uma das maiores espécies de araras, encontrada na região do Pantanal e caatinga.",
      category: "Ave",
      imagePath: null,
    });

    console.log("Espécies iniciais inseridas com sucesso.");
  } else {
    console.log("O banco de dados já contém espécies. Nenhum seed foi executado.");
  }
} catch (error) {
  console.error("Erro ao semear o banco de dados:", error);
  process.exitCode = 1;
} finally {
  database.close();
}
