import Database from "better-sqlite3";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createDatabase } from "../src/database/connection.js";
import { runMigrations } from "../src/database/migrate.js";
import { SpeciesRepository } from "../src/database/species-repository.js";

const createTestDatabase = () => {
  const database = new Database(":memory:");
  database.pragma("journal_mode = WAL");
  database.pragma("foreign_keys = ON");
  runMigrations(database as any);
  return database;
};

describe("SpeciesRepository", () => {
  let database: any;
  let repository: SpeciesRepository;

  beforeEach(() => {
    database = createTestDatabase();
    repository = new SpeciesRepository(database as any);
  });

  afterEach(() => {
    database.close();
  });

  it("creates a new species and returns the id", () => {
    const id = repository.create({
      commonName: "Mico-Leão-Dourado",
      scientificName: "Leontopithecus rosalia",
      location: "Rio de Janeiro",
      threats: "Perda de habitat",
      conservationStatus: "Criticamente em perigo",
      populationTrend: "Decrescente",
      description: "Primata da Mata Atlântica.",
      category: "Mamífero",
      imagePath: null,
    });

    expect(id).toBeGreaterThan(0);
  });

  it("finds a species by id", () => {
    const id = repository.create({
      commonName: "Arara-Azul",
      scientificName: "Anodorhynchus hyacinthinus",
      location: "São Paulo",
      threats: "Caça ilegal",
      conservationStatus: "Em perigo",
      populationTrend: "Decrescente",
      description: "Arara grande e colorida.",
      category: "Ave",
      imagePath: null,
    });

    const species = repository.findById(id);
    expect(species).not.toBeNull();
    expect(species?.scientificName).toBe("Anodorhynchus hyacinthinus");
  });

  it("returns null for missing species id", () => {
    expect(repository.findById(999)).toBeNull();
  });

  it("updates an existing species", () => {
    const id = repository.create({
      commonName: "Peixe-boi",
      scientificName: "Trichechus manatus",
      location: "Espírito Santo",
      threats: "Perda de habitat marinho",
      conservationStatus: "Vulnerável",
      populationTrend: "Estável",
      description: "Mamífero aquático.",
      category: "Mamífero",
      imagePath: null,
    });

    repository.update(id, {
      commonName: "Peixe-boi-da-amazônia",
      scientificName: "Trichechus inunguis",
      location: "Rio de Janeiro",
      threats: "Poluição",
      conservationStatus: "Em perigo",
      populationTrend: "Decrescente",
      description: "Mamífero aquático vulnerável.",
      category: "Mamífero",
      imagePath: null,
    });

    const updated = repository.findById(id);
    expect(updated?.commonName).toBe("Peixe-boi-da-amazônia");
    expect(updated?.location).toBe("Rio de Janeiro");
  });

  it("deletes a species", () => {
    const id = repository.create({
      commonName: "Tartaruga",
      scientificName: "Chelonia mydas",
      location: "São Paulo",
      threats: "Captura para comércio",
      conservationStatus: "Em perigo",
      populationTrend: "Decrescente",
      description: "Tartaruga marinha.",
      category: "Réptil",
      imagePath: null,
    });

    repository.delete(id);
    expect(repository.findById(id)).toBeNull();
  });

  it("filters species by category", () => {
    repository.create({
      commonName: "Rã",
      scientificName: "Rana temporaria",
      location: "Minas Gerais",
      threats: "Poluição",
      conservationStatus: "Vulnerável",
      populationTrend: "Decrescente",
      description: "Anfíbio comum.",
      category: "Anfíbio",
      imagePath: null,
    });

    repository.create({
      commonName: "Arara",
      scientificName: "Ara macao",
      location: "São Paulo",
      threats: "Desmatamento",
      conservationStatus: "Em perigo",
      populationTrend: "Decrescente",
      description: "Ave tropical.",
      category: "Ave",
      imagePath: null,
    });

    const results = repository.findByFilters({ category: "Ave" });
    expect(results).toHaveLength(1);
    expect(results[0].commonName).toBe("Arara");
  });

  it("filters species by location", () => {
    repository.create({
      commonName: "Sapo",
      scientificName: "Bufo bufo",
      location: "Minas Gerais",
      threats: "Perda de habitat",
      conservationStatus: "Vulnerável",
      populationTrend: "Estável",
      description: "Anfíbio típico.",
      category: "Anfíbio",
      imagePath: null,
    });

    const results = repository.findByFilters({ location: "Minas Gerais" });
    expect(results).toHaveLength(1);
    expect(results[0].category).toBe("Anfíbio");
  });

  it("filters species by conservation status", () => {
    repository.create({
      commonName: "Peixe",
      scientificName: "Salmo salar",
      location: "São Paulo",
      threats: "Sobrepesca",
      conservationStatus: "Criticamente em perigo",
      populationTrend: "Decrescente",
      description: "Peixe migratório.",
      category: "Peixe",
      imagePath: null,
    });

    const results = repository.findByFilters({ conservationStatus: "Criticamente em perigo" });
    expect(results).toHaveLength(1);
    expect(results[0].commonName).toBe("Peixe");
  });

  it("finds a species by scientific name", () => {
    const id = repository.create({
      commonName: "Jacaré",
      scientificName: "Caiman yacare",
      location: "São Paulo",
      threats: "Perda de habitat",
      conservationStatus: "Vulnerável",
      populationTrend: "Estável",
      description: "Réptil de água doce.",
      category: "Réptil",
      imagePath: null,
    });

    const found = repository.findByScientificName("Caiman yacare");
    expect(found).not.toBeNull();
    expect(found?.id).toBe(id);
    expect(found?.commonName).toBe("Jacaré");
  });

  it("searches species by term across multiple fields", () => {
    repository.create({
      commonName: "Jacaré",
      scientificName: "Caiman yacare",
      location: "São Paulo",
      threats: "Perda de habitat",
      conservationStatus: "Vulnerável",
      populationTrend: "Estável",
      description: "Réptil de água doce.",
      category: "Réptil",
      imagePath: null,
    });

    const results = repository.findByFilters({ search: "água" });
    expect(results).toHaveLength(1);
    expect(results[0].category).toBe("Réptil");
  });
});
