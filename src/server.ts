import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import expressHandlebars from "express-handlebars";

import { createDatabase } from "./database/connection.js";
import { runMigrations } from "./database/migrate.js";
import { SpeciesRepository } from "./database/species-repository.js";
import { buildFilters, fetchExternalSpeciesSummary, validateSpeciesInput } from "./domain/species-service.js";
import {
  CATEGORY_OPTIONS,
  CONSERVATION_STATUS_OPTIONS,
  LOCATION_OPTIONS,
} from "./domain/species-options.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp({ databasePath }: { databasePath?: string } = {}) {
  const app = express();
  const baseDatabasePath = databasePath ?? process.env.DATABASE_PATH;
  const database = createDatabase(
    baseDatabasePath ?? path.join(process.cwd(), "database", "faunear.sqlite"),
  );

  runMigrations(database);

  const repository = new SpeciesRepository(database);
  const viewsPath = path.join(__dirname, "..", "views");
  const publicPath = path.join(__dirname, "..", "public");

  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(publicPath));

  const handlebars = expressHandlebars.create({
    layoutsDir: path.join(viewsPath, "layouts"),
    defaultLayout: "main",
    partialsDir: path.join(viewsPath, "partials"),
    helpers: {
      ifEquals(arg1: unknown, arg2: unknown, options: any) {
        return arg1 === arg2 ? options.fn(this) : options.inverse(this);
      },
    },
  });

  app.engine("handlebars", handlebars.engine);
  app.set("view engine", "handlebars");
  app.set("views", viewsPath);

  app.use((req, res, next) => {
    res.locals.categories = CATEGORY_OPTIONS;
    res.locals.conservationStatuses = CONSERVATION_STATUS_OPTIONS;
    res.locals.locations = LOCATION_OPTIONS;
    next();
  });

  app.get("/", (req, res) => {
    const filters = buildFilters(req.query);
    const species = repository.findByFilters(filters);

    res.render("home", {
      species,
      filters,
    });
  });

  app.get("/species/new", (req, res) => {
    res.render("form", {
      formTitle: "Cadastrar nova espécie",
      action: "/species",
      species: {},
      submitLabel: "Cadastrar",
      errors: {},
    });
  });

  app.post("/species", (req, res) => {
    const validation = validateSpeciesInput(req.body);

    if (validation.errors && Object.keys(validation.errors).length > 0) {
      return res.status(400).render("form", {
        formTitle: "Cadastrar nova espécie",
        action: "/species",
        species: req.body,
        submitLabel: "Cadastrar",
        errors: validation.errors,
      });
    }

    repository.create(validation.data!);
    res.redirect("/");
  });

  app.get("/species/:id/edit", (req, res) => {
    const id = Number(req.params.id);
    const species = repository.findById(id);

    if (!species) {
      return res.status(404).send("Espécie não encontrada.");
    }

    res.render("form", {
      formTitle: "Editar espécie",
      action: `/species/${id}`,
      species,
      submitLabel: "Salvar alterações",
      errors: {},
    });
  });

  app.post("/species/:id", (req, res) => {
    const id = Number(req.params.id);
    const species = repository.findById(id);

    if (!species) {
      return res.status(404).send("Espécie não encontrada.");
    }

    const validation = validateSpeciesInput(req.body);

    if (validation.errors && Object.keys(validation.errors).length > 0) {
      return res.status(400).render("form", {
        formTitle: "Editar espécie",
        action: `/species/${id}`,
        species: { ...req.body, id },
        submitLabel: "Salvar alterações",
        errors: validation.errors,
      });
    }

    repository.update(id, validation.data!);
    res.redirect("/");
  });

  app.post("/species/:id/delete", (req, res) => {
    const id = Number(req.params.id);
    repository.delete(id);
    res.redirect("/");
  });

  app.post("/species/:id/refresh", async (req, res) => {
    const id = Number(req.params.id);
    const species = repository.findById(id);

    if (!species) {
      return res.status(404).send("Espécie não encontrada.");
    }

    const summary = await fetchExternalSpeciesSummary(species.scientificName);

    if (summary) {
      repository.update(id, {
        commonName: species.commonName,
        scientificName: species.scientificName,
        location: species.location,
        threats: species.threats,
        conservationStatus: species.conservationStatus,
        populationTrend: species.populationTrend,
        description: summary,
        category: species.category,
        imagePath: species.imagePath,
      });
    }

    if (req.headers["hx-request"]) {
      return res.status(204).end();
    }

    res.redirect("/");
  });

  return app;
}

if (process.env.NODE_ENV !== "test") {
  const app = createApp();
  const port = Number(process.env.PORT ?? 3000);

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
}
