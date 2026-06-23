import { afterEach, describe, expect, it, vi } from "vitest";
import { CATEGORY_OPTIONS, CONSERVATION_STATUS_OPTIONS, LOCATION_OPTIONS } from "../src/domain/species-options.js";
import { buildFilters, fetchExternalSpeciesSummary, validateSpeciesInput } from "../src/domain/species-service.js";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("species-service behavior", () => {
  it("builds filters from search query", () => {
    const filters = buildFilters({
      search: "mamífero",
      category: "Mamífero",
      conservationStatus: "Em perigo",
      location: "São Paulo",
    });

    expect(filters.search).toBe("mamífero");
    expect(filters.category).toBe("Mamífero");
    expect(filters.conservationStatus).toBe("Em perigo");
    expect(filters.location).toBe("São Paulo");
  });

  it("ignores empty query values", () => {
    const filters = buildFilters({
      search: "   ",
      category: "",
      conservationStatus: "",
      location: "",
    });

    expect(filters).toEqual({});
  });

  it("validates valid specie input successfully", () => {
    const result = validateSpeciesInput({
      commonName: "Arara-Azul",
      scientificName: "Anodorhynchus hyacinthinus",
      location: "São Paulo",
      threats: "Perda de habitat",
      conservationStatus: "Em perigo",
      populationTrend: "Estável",
      description: "Ave colorida.",
      category: "Ave",
      imagePath: "imagem.jpg",
    });

    expect(result.errors).toEqual({});
    expect(result.data?.scientificName).toBe("Anodorhynchus hyacinthinus");
  });

  it("returns an error for invalid conservation status", () => {
    const validation = validateSpeciesInput({
      commonName: "Arara",
      scientificName: "Ara macao",
      location: "São Paulo",
      threats: "Desmatamento",
      conservationStatus: "Desconhecido",
      populationTrend: "Estável",
      description: "Ave.",
      category: "Ave",
      imagePath: "",
    });

    expect(validation.errors.conservationStatus).toBe("O status de conservação selecionado não é válido.");
  });

  it("returns an error for invalid category", () => {
    const validation = validateSpeciesInput({
      commonName: "Peixe",
      scientificName: "Salmo salar",
      location: "São Paulo",
      threats: "Sobrepesca",
      conservationStatus: "Em perigo",
      populationTrend: "Estável",
      description: "Peixe.",
      category: "Peixe exótico",
      imagePath: "",
    });

    expect(validation.errors.category).toBe("A categoria taxonômica selecionada não é válida.");
  });

  it("returns an error for invalid location", () => {
    const validation = validateSpeciesInput({
      commonName: "Sapo",
      scientificName: "Bufo bufo",
      location: "Bahia",
      threats: "Poluição",
      conservationStatus: "Vulnerável",
      populationTrend: "Estável",
      description: "Anfíbio.",
      category: "Anfíbio",
      imagePath: "",
    });

    expect(validation.errors.location).toBe("A localização selecionada não é válida.");
  });

  it("exports options arrays for UI choices", () => {
    expect(CATEGORY_OPTIONS.length).toBeGreaterThan(0);
    expect(CONSERVATION_STATUS_OPTIONS).toContain("Em perigo");
    expect(LOCATION_OPTIONS).toContain("São Paulo");
  });

  it("fetches an external species summary successfully", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ extract: "Resumo da espécie." }) })) as any);

    const summary = await fetchExternalSpeciesSummary("Leontopithecus rosalia");

    expect(summary).toBe("Resumo da espécie.");
    expect(global.fetch).toHaveBeenCalled();
  });

  it("returns null when the external API fails", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve({ ok: false })) as any);

    const summary = await fetchExternalSpeciesSummary("Leontopithecus rosalia");

    expect(summary).toBeNull();
  });
});
