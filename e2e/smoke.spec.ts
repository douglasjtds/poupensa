// Smoke E2E — roda sem Supabase configurado: landing, telas de auth e
// proteção de rota client-side.

import { expect, test } from "@playwright/test";

test("landing mostra a proposta e os CTAs", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /quem pensa na despensa/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /começar grátis/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /já tenho conta/i })).toBeVisible();
});

test("login tem formulário de email/senha e opção Google", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Senha")).toBeVisible();
  await expect(page.getByRole("button", { name: /^entrar$/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /google/i })).toBeVisible();
});

test("signup pede nome, email e senha", async ({ page }) => {
  await page.goto("/signup");
  await expect(page.getByLabel("Seu nome")).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Senha")).toBeVisible();
});

test("rota protegida redireciona visitante para /login", async ({ page }) => {
  await page.goto("/despensa");
  await page.waitForURL(/\/login/);
  await expect(page.getByRole("button", { name: /^entrar$/i })).toBeVisible();
});

test("manifest e service worker estão publicados", async ({ page, request }) => {
  const manifest = await request.get("/manifest.webmanifest");
  expect(manifest.ok()).toBe(true);
  expect((await manifest.json()).name).toBe("Poupensa");

  const sw = await request.get("/sw.js");
  expect(sw.ok()).toBe(true);

  await page.goto("/");
  const link = page.locator('link[rel="manifest"]');
  await expect(link).toHaveAttribute("href", "/manifest.webmanifest");
});
