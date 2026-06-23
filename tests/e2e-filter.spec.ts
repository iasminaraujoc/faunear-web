import { expect, test } from "@playwright/test";

test("should display filter fields on the home page", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByPlaceholder("Buscar por nome, descrição ou categoria")).toBeVisible();
  await expect(page.getByRole("combobox", { name: "Categoria" })).toBeVisible();
  await expect(page.getByRole("combobox", { name: "Status de Conservação" })).toBeVisible();
  await expect(page.getByRole("combobox", { name: "Localização" })).toBeVisible();
});

test("should filter species by search term", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("Buscar por nome, descrição ou categoria").fill("Mico");
  await page.click("button:has-text('Filtrar')");
  await expect(page.getByText(/Nenhuma espécie encontrada|Mico/)).toBeVisible();
});
