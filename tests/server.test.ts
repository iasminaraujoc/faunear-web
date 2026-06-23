import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { createApp } from "../src/server.js";
import { createDatabase } from "../src/database/connection.js";

const database = createDatabase(":memory:");
const app = createApp({ database });

beforeAll(() => {
  database.pragma("foreign_keys = ON");
});

afterAll(() => {
  database.close();
});

describe("server routes", () => {
  it("returns the home page", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toContain("Espécies em Extinção");
  });

  it("renders the create species form", async () => {
    const response = await request(app).get("/species/new");
    expect(response.status).toBe(200);
    expect(response.text).toContain("Cadastrar nova espécie");
  });

  it("creates a species via POST and redirects", async () => {
    const response = await request(app)
      .post("/species")
      .send(
        "commonName=Mico%20Le%C3%A3o&scientificName=Leontopithecus%20rosalia&location=Rio%20de%20Janeiro&threats=Perda%20de%20habitat&conservationStatus=Criticamente%20em%20perigo&populationTrend=Decrescente&description=Primata&category=Mam%C3%ADfero&imagePath=",
      )
      .set("Content-Type", "application/x-www-form-urlencoded");

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe("/");
  });

  it("redirects to home when scientific name already exists (unique constraint)", async () => {
    // cria uma 1ª vez
    await request(app)
      .post("/species")
      .send(
        "commonName=Primeiro%20Mico&scientificName=Leontopithecus%20rosalia&location=Rio%20de%20Janeiro&threats=Perda%20de%20habitat&conservationStatus=Criticamente%20em%20perigo&populationTrend=Decrescente&description=Primata&category=Mam%C3%ADfero&imagePath=",
      )
      .set("Content-Type", "application/x-www-form-urlencoded");

    // tenta criar de novo com o mesmo scientificName (deve redirecionar em vez de renderizar erro)
    const response = await request(app)
      .post("/species")
      .send(
        "commonName=Segundo%20Mico&scientificName=Leontopithecus%20rosalia&location=Rio%20de%20Janeiro&threats=Perda%20de%20habitat&conservationStatus=Criticamente%20em%20perigo&populationTrend=Decrescente&description=Primata&category=Mam%C3%ADfero&imagePath=",
      )
      .set("Content-Type", "application/x-www-form-urlencoded");

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe("/");
  });

  it("returns 400 when required fields are missing", async () => {
    const response = await request(app)
      .post("/species")
      .send("commonName=&scientificName=&location=&threats=&conservationStatus=&description=&category=")
      .set("Content-Type", "application/x-www-form-urlencoded");

    expect(response.status).toBe(400);
    expect(response.text).toContain("O nome comum é obrigatório");
  });
});
