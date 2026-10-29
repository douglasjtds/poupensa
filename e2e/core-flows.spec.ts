// E2E dos 2 fluxos críticos do MVP-SCOPE.md + cenário de 2 usuários do mesmo
// household. Exige um Supabase real com as migrations e o seed aplicados
// (usuários douglas@teste.poupensa.app / iara@teste.poupensa.app, senha
// password123 — ver supabase/seed.sql) e NEXT_PUBLIC_SUPABASE_URL/ANON_KEY no
// ambiente. Sem isso, os testes são pulados (skip) com aviso.

import { expect, test, type Page } from "@playwright/test";

const HAS_SUPABASE =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const USER_A = process.env.E2E_USER_A_EMAIL ?? "douglas@teste.poupensa.app";
const USER_B = process.env.E2E_USER_B_EMAIL ?? "iara@teste.poupensa.app";
const PASSWORD = process.env.E2E_PASSWORD ?? "password123";

test.skip(!HAS_SUPABASE, "Supabase não configurado (NEXT_PUBLIC_SUPABASE_URL/ANON_KEY)");

async function login(page: Page, email: string) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Senha").fill(PASSWORD);
  await page.getByRole("button", { name: /^entrar$/i }).click();
  await page.waitForURL(/\/despensa/);
}

test.describe.serial("Fluxos críticos", () => {
  const itemName = `Azeite E2E ${Date.now()}`;

  test("Fluxo 1 — registro de compra: loga, adiciona item, registra e persiste", async ({
    page,
  }) => {
    await login(page, USER_A);

    // adiciona item novo
    await page.getByRole("button", { name: /^item$/i }).click();
    await page.getByLabel("Nome").fill(itemName);
    await page.getByRole("button", { name: /adicionar item/i }).click();
    await expect(page.getByText(itemName)).toBeVisible();

    // registra compra do item
    await page.getByRole("link", { name: /compra/i }).click();
    await page.waitForURL(/\/compra/);
    await page.getByLabel(`Quantidade comprada de ${itemName}`).fill("2");
    await page.getByRole("button", { name: /registrar compra/i }).click();
    await expect(page.getByText(/compra registrada/i)).toBeVisible();

    // persistiu: badge "comprado" na despensa
    await page.getByRole("link", { name: /despensa/i }).click();
    const card = page.locator("li", { hasText: itemName });
    await expect(card.getByText(/comprado 2/i)).toBeVisible();
  });

  test("2 usuários: o parceiro vê a compra e faz a conferência", async ({ browser }) => {
    // Iara (2º membro do household) em um contexto separado
    const context = await browser.newContext();
    const page = await context.newPage();
    await login(page, USER_B);

    // vê o item e a compra registrados pelo Douglas
    await expect(page.getByText(itemName)).toBeVisible();

    // conferência: informa quanto sobrou
    await page.getByRole("link", { name: /conferência/i }).click();
    await page.waitForURL(/\/conferencia/);
    await page.getByLabel(`Quanto sobrou de ${itemName}`).fill("0,5");
    await page.getByRole("button", { name: /salvar conferência/i }).click();
    await page.waitForURL(/\/lista/);
    await context.close();
  });

  test("Fluxo 2 — lista gerada com sugestão, editável, finaliza e pré-preenche a compra", async ({
    page,
  }) => {
    await login(page, USER_A);
    await page.getByRole("link", { name: /lista/i }).click();
    await page.waitForURL(/\/lista/);

    // item aparece com sugestão calculada (badge lilás) e entra na lista
    const row = page.locator("li", { hasText: itemName });
    await expect(row).toBeVisible();

    // edita a quantidade sugerida
    const qty = row.getByLabel(`Quantidade de ${itemName} na lista`);
    await qty.fill("3");

    await page.getByRole("button", { name: /finalizar lista/i }).click();
    await page.waitForURL(/\/compra/);

    // compra pré-preenchida com a lista finalizada
    await expect(page.getByLabel(`Quantidade comprada de ${itemName}`)).toHaveValue("3");
  });
});
