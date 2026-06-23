import { describe, expect, it } from "vitest";

import { validateSpeciesInput } from "../src/domain/species-service.js";

describe("validateSpeciesInput", () => {
  it("returns data when all required fields are valid", () => {
    const result = validateSpeciesInput({
      commonName: "Mico-Leão-Dourado",
      scientificName: "Leontopithecus rosalia",
      location: "Rio de Janeiro",
      threats: "Perda de habitat",
      conservationStatus: "Criticamente em perigo",
      populationTrend: "Decrescente",
      description: "Descrição curta.",
      category: "Mamífero",
      imagePath: "",
    });

    expect(result.errors).toEqual({});
    expect(result.data).toEqual({
      commonName: "Mico-Leão-Dourado",
      scientificName: "Leontopithecus rosalia",
      location: "Rio de Janeiro",
      threats: "Perda de habitat",
      conservationStatus: "Criticamente em perigo",
      populationTrend: "Decrescente",
      description: "Descrição curta.",
      category: "Mamífero",
      imagePath: null,
    });
  });

  it("returns errors for missing required fields", () => {
    const result = validateSpeciesInput({});

    expect(Object.keys(result.errors)).toEqual(
      expect.arrayContaining([
        "commonName",
        "scientificName",
        "location",
        "threats",
        "conservationStatus",
        "description",
        "category",
      ]),
    );
    expect(result.data).toBeUndefined();
  });
});
