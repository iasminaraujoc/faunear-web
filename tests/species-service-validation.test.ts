import { describe, expect, it } from "vitest";
import { validateSpeciesInput } from "../src/domain/species-service.js";

describe("species validation edge cases", () => {
  it("trims whitespace from input values", () => {
    const result = validateSpeciesInput({
      commonName: "  Arara  ",
      scientificName: "  Ara macao  ",
      location: "  São Paulo  ",
      threats: "  Desmatamento  ",
      conservationStatus: "  Em perigo  ",
      populationTrend: "  Estável  ",
      description: "  Uma ave.  ",
      category: "  Ave  ",
      imagePath: "  imagem.png  ",
    });

    expect(result.errors).toEqual({});
    expect(result.data?.commonName).toBe("Arara");
    expect(result.data?.imagePath).toBe("imagem.png");
  });

  it("allows missing optional populationTrend", () => {
    const result = validateSpeciesInput({
      commonName: "Rã",
      scientificName: "Rana temporaria",
      location: "Minas Gerais",
      threats: "Perda de habitat",
      conservationStatus: "Vulnerável",
      populationTrend: "",
      description: "Anfíbio.",
      category: "Anfíbio",
      imagePath: "",
    });

    expect(result.errors).toEqual({});
    expect(result.data?.populationTrend).toBeNull();
  });

  it("returns multiple validation errors at once", () => {
    const result = validateSpeciesInput({
      commonName: "",
      scientificName: "",
      location: "",
      threats: "",
      conservationStatus: "",
      populationTrend: "",
      description: "",
      category: "",
      imagePath: "",
    });

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
  });
});
