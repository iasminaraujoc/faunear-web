import { expect, test } from "@playwright/test";

test("home page loads and navigation works", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Espécies em Extinção" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Cadastrar nova espécie" })).toBeVisible();

  await page.getByRole("link", { name: "Cadastrar nova espécie" }).click();
  await expect(page.getByRole("heading", { name: "Cadastrar nova espécie" })).toBeVisible();
});
