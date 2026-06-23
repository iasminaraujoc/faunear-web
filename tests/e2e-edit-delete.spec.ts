import { expect, test } from "@playwright/test";

test("should open edit page from home and cancel", async ({ page }) => {
  await page.goto("/");
  const createLink = page.getByRole("link", { name: "Cadastrar nova espécie" });
  await expect(createLink).toBeVisible();
  await createLink.click();

  await page.getByLabel("Nome comum").fill("Arara-Teste");
  await page.getByLabel("Nome científico").fill("Ara testus");
  await page.getByLabel("Categoria").selectOption("Ave");
  await page.getByLabel("Localização").selectOption("São Paulo");
  await page.getByLabel("Ameaças").fill("Desmatamento");
  await page.getByLabel("Status de conservação").selectOption("Em perigo");
  await page.getByLabel("Descrição").fill("Ave de teste.");
  await page.click("button:has-text('Cadastrar')");

  await expect(page).toHaveURL("/");
  await page.getByRole("link", { name: "Editar" }).first().click();
  await expect(page.getByRole("heading", { name: "Editar espécie" })).toBeVisible();
});

test("should delete a species from the card list", async ({ page }) => {
  await page.goto("/species/new");
  await page.getByLabel("Nome comum").fill("Répteis-Teste");
  await page.getByLabel("Nome científico").fill("Testudo reptilis");
  await page.getByLabel("Categoria").selectOption("Réptil");
  await page.getByLabel("Localização").selectOption("São Paulo");
  await page.getByLabel("Ameaças").fill("Perda de habitat");
  await page.getByLabel("Status de conservação").selectOption("Vulnerável");
  await page.getByLabel("Descrição").fill("Réptil de teste.");
  await page.click("button:has-text('Cadastrar')");

  await expect(page).toHaveURL("/");
  const deleteButton = page.getByRole("button", { name: "Excluir" }).first();
  await expect(deleteButton).toBeVisible();
});
