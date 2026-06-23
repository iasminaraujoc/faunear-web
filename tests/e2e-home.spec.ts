import { expect, test } from "@playwright/test";

test("should navigate from home to create form", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Espécies em Extinção" })).toBeVisible();
  await page.getByRole("link", { name: "Cadastrar nova espécie" }).click();
  await expect(page.getByRole("heading", { name: "Cadastrar nova espécie" })).toBeVisible();
});

test("should submit the species creation form and show redirect", async ({ page }) => {
  await page.goto("/species/new");
  await page.getByLabel("Nome comum").fill("Mico-Leão-Dourado");
  await page.getByLabel("Nome científico").fill("Leontopithecus rosalia");
  await page.getByLabel("Categoria").selectOption("Mamífero");
  await page.getByLabel("Localização").selectOption("Rio de Janeiro");
  await page.getByLabel("Ameaças").fill("Perda de habitat");
  await page.getByLabel("Status de conservação").selectOption("Criticamente em perigo");
  await page.getByLabel("Tendência populacional").fill("Decrescente");
  await page.getByLabel("Descrição").fill("Primata ameaçado de extinção.");
  await page.click("button:has-text('Cadastrar')");
  await expect(page).toHaveURL("/");
});
