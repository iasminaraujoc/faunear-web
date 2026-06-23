import request from "supertest";
import { describe, expect, it } from "vitest";

import { createApp } from "../src/server.js";
import { createDatabase } from "../src/database/connection.js";

// Mock do fetch para evitar acesso à rede durante os testes.
const mockFetch = async () => ({
  ok: true,
  json: async () => ({ extract: "Resumo de teste" }),
});

describe("server refresh HTMX branches", () => {
  it("returns 204 when hx-request header is present", async () => {
    const originalFetch = globalThis.fetch;
    // @ts-ignore
    globalThis.fetch = mockFetch;

    const database = createDatabase(":memory:");
    const app = createApp({ database });

    // cria uma espécie
    const createRes = await request(app)
      .post("/species")
      .send(
        "commonName=Teste Refresh&scientificName=Refresh species&location=São Paulo&threats=Teste&conservationStatus=Vulnerável&populationTrend=Estável&description=Desc&category=Réptil&imagePath=",
      )
      .set("Content-Type", "application/x-www-form-urlencoded");

    expect([302, 201]).toContain(createRes.status);

    // pega id pela criação (o schema garante autoincrement, mas sem expor id via response;
    // então fazemos insert via repository seria o ideal. Aqui simplificamos pegando o primeiro).
    // A forma mais robusta no projeto seria expor endpoint; então usamos search endpoint.
    const listRes = await request(app).get("/");
    expect(listRes.status).toBe(200);

    // Extrai id do HTML do primeiro card.
    const match = listRes.text.match(/\/species\/(\d+)\/edit/);
    expect(match).not.toBeNull();
    const id = Number(match?.[1]);

    const res = await request(app)
      .post(`/species/${id}/refresh`)
      .set("HX-Request", "true");

    expect(res.status).toBe(204);

    // @ts-ignore
    globalThis.fetch = originalFetch;
    database.close();
  });

  it("redirects to home when hx-request header is NOT present", async () => {
    const originalFetch = globalThis.fetch;
    // @ts-ignore
    globalThis.fetch = mockFetch;

    const database = createDatabase(":memory:");
    const app = createApp({ database });

    const createRes = await request(app)
      .post("/species")
      .send(
        "commonName=Teste Refresh 2&scientificName=Refresh species 2&location=São Paulo&threats=Teste&conservationStatus=Vulnerável&populationTrend=Estável&description=Desc&category=Réptil&imagePath=",
      )
      .set("Content-Type", "application/x-www-form-urlencoded");

    expect([302, 201]).toContain(createRes.status);

    const listRes = await request(app).get("/");
    expect(listRes.status).toBe(200);

    const match = listRes.text.match(/\/species\/(\d+)\/edit/);
    expect(match).not.toBeNull();
    const id = Number(match?.[1]);

    const res = await request(app)
      .post(`/species/${id}/refresh`)
      .set("Content-Type", "application/x-www-form-urlencoded");

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("/");

    // @ts-ignore
    globalThis.fetch = originalFetch;
    database.close();
  });
});

