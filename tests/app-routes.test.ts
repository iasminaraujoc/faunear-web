import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";

import { createApp } from "../src/server.js";
import { createDatabase } from "../src/database/connection.js";

const database = createDatabase(":memory:");
const app = createApp({ database });

beforeAll(() => {
  database.pragma("foreign_keys = ON");
});

describe("App routes", () => {
  it("returns 404 for missing species edit", async () => {
    const response = await request(app).get("/species/123/edit");
    expect(response.status).toBe(404);
    expect(response.text).toContain("Espécie não encontrada");
  });

  it("returns 404 for refresh on missing species", async () => {
    const response = await request(app).post("/species/123/refresh");
    expect(response.status).toBe(404);
  });

  it("can list species after creation", async () => {
    await request(app)
      .post("/species")
      .send(
        "commonName=Tartaruga&scientificName=Chelonia%20mydas&location=São%20Paulo&threats=Captura&conservationStatus=Em%20perigo&description=Marinha&category=Réptil&imagePath=",
      )
      .set("Content-Type", "application/x-www-form-urlencoded");

    const response = await request(app).get("/");
    expect(response.text).toContain("Tartaruga");
  });
});
