export interface Species {
  id: number;
  commonName: string;
  scientificName: string;
  location: string;
  threats: string;
  conservationStatus: string;
  populationTrend: string | null;
  description: string;
  category: string;
  imagePath: string | null;
}

export type NewSpecies = Omit<Species, "id">;

export interface SpeciesFilters {
  search?: string;
  commonName?: string;
  scientificName?: string;
  category?: string;
  conservationStatus?: string;
  location?: string;
}