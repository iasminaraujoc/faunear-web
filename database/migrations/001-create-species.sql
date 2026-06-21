CREATE TABLE IF NOT EXISTS species (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    common_name TEXT NOT NULL,
    scientific_name TEXT NOT NULL UNIQUE,
    location TEXT NOT NULL,
    threats TEXT NOT NULL,
    conservation_status TEXT NOT NULL,
    population_trend TEXT,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    image_path TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_species_common_name
ON species(common_name);

CREATE INDEX IF NOT EXISTS idx_species_scientific_name
ON species(scientific_name);

CREATE INDEX IF NOT EXISTS idx_species_category
ON species(category);

CREATE INDEX IF NOT EXISTS idx_species_conservation_status
ON species(conservation_status);