import { expect, test } from "@playwright/test";

test("should refresh species summary using HTMX", async ({ page }) => {
  await page.goto("/species/new");
  await page.getByLabel("Nome comum").fill("Teste-Refresh");
  await page.getByLabel("Nome científico").fill("Testudo refresher");
  await page.getByLabel("Categoria").selectOption("Réptil");
  await page.getByLabel("Localização").selectOption("São Paulo");
  await page.getByLabel("Ameaças").fill("Teste");
  await page.getByLabel("Status de conservação").selectOption("Vulnerável");
  await page.getByLabel("Descrição").fill("Descrição de teste.");
  await page.click("button:has-text('Cadastrar')");

  await expect(page).toHaveURL("/");
  await page.getByRole("button", { name: "Atualizar resumo" }).first().click();
  await expect(page).toHaveURL("/");
});
