import type { AppDatabase } from "./connection.js";
import type { NewSpecies, Species, SpeciesFilters } from "../domain/species.js";

function mapRowToSpecies(row: any): Species {
  return {
    id: row.id,
    commonName: row.common_name,
    scientificName: row.scientific_name,
    location: row.location,
    threats: row.threats,
    conservationStatus: row.conservation_status,
    populationTrend: row.population_trend ?? null,
    description: row.description,
    category: row.category,
    imagePath: row.image_path ?? null,
  };
}

export class SpeciesRepository {
  #db: AppDatabase;

  constructor(database: AppDatabase) {
    this.#db = database;
  }

  findByFilters(filters: SpeciesFilters): Species[] {
    const conditions: string[] = [];
    const parameters: unknown[] = [];

    if (filters.search) {
      const search = `%${filters.search}%`;
      conditions.push(
        `(common_name LIKE ? OR scientific_name LIKE ? OR description LIKE ? OR category LIKE ? OR location LIKE ?)`,
      );
      parameters.push(search, search, search, search, search);
    }

    if (filters.category) {
      conditions.push("category = ?");
      parameters.push(filters.category);
    }

    if (filters.conservationStatus) {
      conditions.push("conservation_status = ?");
      parameters.push(filters.conservationStatus);
    }

    if (filters.location) {
      conditions.push("location = ?");
      parameters.push(filters.location);
    }

    const whereClause = conditions.length > 0
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const statement = this.#db.prepare(`
      SELECT id,
        common_name,
        scientific_name,
        location,
        threats,
        conservation_status,
        population_trend,
        description,
        category,
        image_path
      FROM species
      ${whereClause}
      ORDER BY created_at DESC
    `);

    return statement.all(...parameters).map(mapRowToSpecies);
  }

  findById(id: number): Species | null {
    const row = this.#db.prepare(
      `SELECT id,
        common_name,
        scientific_name,
        location,
        threats,
        conservation_status,
        population_trend,
        description,
        category,
        image_path
      FROM species
      WHERE id = ?
    `,
    ).get(id);

    return row ? mapRowToSpecies(row) : null;
  }

  findByScientificName(scientificName: string): Species | null {
    const row = this.#db
      .prepare(
        `SELECT id,
          common_name,
          scientific_name,
          location,
          threats,
          conservation_status,
          population_trend,
          description,
          category,
          image_path
        FROM species
        WHERE scientific_name = ?
      `,
      )
      .get(scientificName);

    return row ? mapRowToSpecies(row) : null;
  }

  create(data: NewSpecies): number {
    const statement = this.#db.prepare(
      `INSERT INTO species (
         common_name,
         scientific_name,
         location,
         threats,
         conservation_status,
         population_trend,
         description,
         category,
         image_path
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
    );

    const result = statement.run(
      data.commonName,
      data.scientificName,
      data.location,
      data.threats,
      data.conservationStatus,
      data.populationTrend,
      data.description,
      data.category,
      data.imagePath,
    );

    return Number(result.lastInsertRowid);
  }

  update(id: number, data: NewSpecies): void {
    const statement = this.#db.prepare(
      `UPDATE species SET
         common_name = ?,
         scientific_name = ?,
         location = ?,
         threats = ?,
         conservation_status = ?,
         population_trend = ?,
         description = ?,
         category = ?,
         image_path = ?,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = ?
      `,
    );

    statement.run(
      data.commonName,
      data.scientificName,
      data.location,
      data.threats,
      data.conservationStatus,
      data.populationTrend,
      data.description,
      data.category,
      data.imagePath,
      id,
    );
  }

  delete(id: number): void {
    this.#db.prepare("DELETE FROM species WHERE id = ?").run(id);
  }
}
