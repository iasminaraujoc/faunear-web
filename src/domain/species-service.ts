import type { NewSpecies, SpeciesFilters } from "./species.js";
import {
  CATEGORY_OPTIONS,
  CONSERVATION_STATUS_OPTIONS,
  LOCATION_OPTIONS,
} from "./species-options.js";

export interface ValidationResult {
  data?: NewSpecies;
  errors: Record<string, string>;
}

export function buildFilters(query: Record<string, unknown>): SpeciesFilters {
  const filters: SpeciesFilters = {};

  if (typeof query.search === "string" && query.search.trim()) {
    filters.search = query.search.trim();
  }

  if (typeof query.category === "string" && query.category.trim()) {
    filters.category = query.category.trim();
  }

  if (
    typeof query.conservationStatus === "string" &&
    query.conservationStatus.trim()
  ) {
    filters.conservationStatus = query.conservationStatus.trim();
  }

  if (typeof query.location === "string" && query.location.trim()) {
    filters.location = query.location.trim();
  }

  return filters;
}

export function validateSpeciesInput(
  input: Record<string, string | undefined>,
): ValidationResult {
  const errors: Record<string, string> = {};

  const commonName = input.commonName?.trim() ?? "";
  const scientificName = input.scientificName?.trim() ?? "";
  const location = input.location?.trim() ?? "";
  const threats = input.threats?.trim() ?? "";
  const conservationStatus = input.conservationStatus?.trim() ?? "";
  const populationTrend = input.populationTrend?.trim() ?? "";
  const description = input.description?.trim() ?? "";
  const category = input.category?.trim() ?? "";
  const imagePath = input.imagePath?.trim() ?? "";

  if (!commonName) {
    errors.commonName = "O nome comum é obrigatório.";
  }

  if (!scientificName) {
    errors.scientificName = "O nome científico é obrigatório.";
  }

  if (!location) {
    errors.location = "O habitat ou localização é obrigatório.";
  }

  if (!threats) {
    errors.threats = "A descrição das ameaças é obrigatória.";
  }

  if (!conservationStatus) {
    errors.conservationStatus = "O status de conservação é obrigatório.";
  }

  if (!description) {
    errors.description = "A descrição da espécie é obrigatória.";
  }

  if (!category) {
    errors.category = "A categoria taxonômica é obrigatória.";
  }

  if (
    conservationStatus &&
    !CONSERVATION_STATUS_OPTIONS.includes(conservationStatus as any)
  ) {
    errors.conservationStatus = "O status de conservação selecionado não é válido.";
  }

  if (category && !CATEGORY_OPTIONS.some((item) => item.value === category)) {
    errors.category = "A categoria taxonômica selecionada não é válida.";
  }

  if (location && !LOCATION_OPTIONS.includes(location as any)) {
    errors.location = "A localização selecionada não é válida.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
    };
  }

  return {
    data: {
      commonName,
      scientificName,
      location,
      threats,
      conservationStatus,
      populationTrend: populationTrend || null,
      description,
      category,
      imagePath: imagePath || null,
    },
    errors,
  };
}

export async function fetchExternalSpeciesSummary(
  scientificName: string,
): Promise<string | null> {
  const slug = encodeURIComponent(scientificName.replace(/\s+/g, "_"));
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${slug}`;

  try {
    const response = await fetch(url, {
      headers: { "Accept": "application/json" },
    });

    if (!response.ok) {
      return null;
    }

    const payload = await response.json() as { extract?: string };
    return payload.extract?.trim() ?? null;
  } catch {
    return null;
  }
}
