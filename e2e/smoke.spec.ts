// Smoke E2E — roda sem Supabase configurado: landing, telas de auth e
// proteção de rota client-side.

import { expect, test } from "@playwright/test";

test("landing mostra a proposta e os CTAs", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /quem pensa na despensa/i })).toBeVisible();
  // Há mais de um CTA (hero, cabeçalho no desktop, final): checa o do hero e o final.
  await expect(
    page
      .getByRole("main")
      .getByRole("link", { name: /começar grátis/i })
      .first()
  ).toBeVisible();
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

test("login leva ao pedido de link de redefinição de senha", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("link", { name: /esqueci minha senha/i }).click();
  await expect(page).toHaveURL(/\/esqueci-senha$/);
  // CardTitle do shadcn é uma div, não um heading.
  await expect(page.getByText("Esqueci minha senha", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByRole("button", { name: /enviar link/i })).toBeVisible();
});

test("redefinir senha exige sessão ou mostra a senha nova duas vezes", async ({ page }) => {
  await page.goto("/redefinir-senha");
  // Com Supabase configurado, o proxy manda o visitante sem sessão para o login;
  // sem Supabase (CI), o proxy não roda e a tela abre.
  if (new URL(page.url()).pathname === "/login") {
    expect(new URL(page.url()).searchParams.get("next")).toBe("/redefinir-senha");
    return;
  }
  await expect(page.getByLabel("Senha nova", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Repita a senha nova")).toBeVisible();
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

test.describe("landing", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("CTAs apontam para /signup e /login", async ({ page }) => {
    const ctas = page.getByRole("link", { name: /^começar grátis$/i });
    // Cabeçalho (só desktop), hero e final: ao menos hero + final no mobile.
    expect(await ctas.count()).toBeGreaterThanOrEqual(2);
    for (const cta of await ctas.all()) {
      await expect(cta).toHaveAttribute("href", "/signup");
    }
    // Inclui os links ocultos por breakpoint: nenhum "Começar grátis" aponta para outro lugar.
    const all = page.locator("a", { hasText: /^\s*começar grátis\s*$/i });
    for (const link of await all.all()) {
      await expect(link).toHaveAttribute("href", "/signup");
    }
    await expect(page.getByRole("link", { name: /^já tenho conta$/i })).toHaveAttribute(
      "href",
      "/login"
    );
  });

  test("há um único H1, com a tagline", async ({ page }) => {
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText("Quem pensa na despensa, poupa.");
  });

  test("Ver como funciona leva à seção #como-funciona", async ({ page }) => {
    await page.getByRole("link", { name: /ver como funciona/i }).click();
    await expect(page).toHaveURL(/#como-funciona$/);
    const section = page.locator("#como-funciona");
    await expect(section).toBeVisible();
    await expect(section).toBeInViewport();
    await expect(section.getByRole("heading", { level: 2 })).toBeVisible();
  });

  test("demo recalcula pelo teclado e anuncia o resultado", async ({ page }) => {
    const demo = page.locator('[data-slot="check-demo"]');
    const slider = demo.getByRole("slider", { name: /quanto sobrou/i });
    const live = demo.locator('[data-slot="check-demo-result"]');
    await expect(live).toHaveAttribute("aria-live", "polite");
    await slider.scrollIntoViewIfNeeded();
    await slider.focus();

    const cases: [number, string][] = [
      [0, "Acabou antes da hora. Próxima compra: 6 kg."],
      [1, "Vocês usaram 4 kg e ainda têm 1 kg. Próxima compra: 3 kg."],
      [2, "Vocês usaram 3 kg e ainda têm 2 kg. Próxima compra: 1 kg."],
      [3, "Neste mês, pode pular o arroz."],
      [4, "Neste mês, pode pular o arroz."],
      [5, "Neste mês, pode pular o arroz."],
    ];
    await slider.press("Home");
    for (const [left, text] of cases) {
      await expect(slider).toHaveAttribute("aria-valuenow", String(left));
      await expect(slider).toHaveAttribute("aria-valuetext", `${left} kg`);
      await expect(live).toHaveText(text);
      await slider.press("ArrowRight");
    }
  });

  test("passo 3 de Como funciona mostra 3 kg calculados", async ({ page }) => {
    const step3 = page.locator("#como-funciona").getByRole("listitem").nth(2);
    await expect(step3.getByRole("heading", { level: 3 })).toHaveText("Recebam a lista pronta");
    await expect(step3.locator("dt")).toHaveText("Arroz · Próxima compra");
    await expect(step3.locator("dd")).toHaveText("3 kg");
    const steps = page.locator("#como-funciona").getByRole("listitem");
    await expect(steps.nth(0).locator("dt")).toHaveText("Arroz · Compraram");
    await expect(steps.nth(0).locator("dd")).toHaveText("5 kg");
    await expect(steps.nth(1).locator("dt")).toHaveText("Arroz · Sobrou");
    await expect(steps.nth(1).locator("dd")).toHaveText("1 kg");
    await expect(
      page.locator("#como-funciona").getByText("Exemplo", { exact: true })
    ).toBeVisible();
  });

  test("FAQ de fase de testes explica o estágio do app", async ({ page }) => {
    const item = page.locator("details", { hasText: "O que significa" });
    await item
      .getByText(/fase de testes/)
      .first()
      .click();
    await expect(item).toHaveAttribute("open", "");
    await expect(
      item.getByText(
        "O Poupensa ainda está em construção. Telas e cálculos podem mudar, e pode aparecer alguma falha pelo caminho."
      )
    ).toBeVisible();
  });

  test("lista do hero mostra as sugestões calculadas e o selo Exemplo", async ({ page }) => {
    const list = page.getByRole("list").filter({ hasText: "Arroz" }).first();
    const rows = list.getByRole("listitem");
    await expect(rows).toHaveCount(3);
    await expect(rows.nth(0)).toContainText("Arroz");
    await expect(rows.nth(0)).toContainText("3 kg");
    await expect(rows.nth(1)).toContainText("Café");
    await expect(rows.nth(1)).toContainText("2 pacotes");
    await expect(rows.nth(2)).toContainText("Sabão em pó");
    await expect(rows.nth(2)).toContainText("pode pular");
    const hero = page.locator("section").first();
    await expect(hero.getByText("Exemplo", { exact: true })).toBeVisible();
  });

  test("FAQ tem 6 perguntas que abrem, e a oferta fica junto dos CTAs", async ({ page }) => {
    const items = page.locator("details");
    await expect(items).toHaveCount(6);
    const first = items.first();
    await expect(first).not.toHaveAttribute("open", "");
    await first.scrollIntoViewIfNeeded();
    await first.getByText("Preciso registrar toda vez").click();
    await expect(first).toHaveAttribute("open", "");
    await expect(first.getByText(/Bastam a compra e a conferência/)).toBeVisible();

    const main = page.getByRole("main");
    const heroCta = main.getByRole("link", { name: /^começar grátis$/i }).first();
    await expect(heroCta.locator("xpath=..")).toContainText("3 meses grátis");
    const finalCta = main.getByRole("link", { name: /^começar grátis$/i }).last();
    await expect(finalCta.locator("xpath=..")).toContainText("3 meses grátis");
  });

  for (const [name, href] of [
    ["Privacidade", "/privacidade"],
    ["Termos", "/termos"],
  ] as const) {
    test(`${href} é pública e alcançável pelo rodapé`, async ({ page }) => {
      await page.getByRole("contentinfo").getByRole("link", { name }).click();
      await expect(page).toHaveURL(new RegExp(`${href}$`));
      await expect(page.getByRole("heading", { level: 1, name })).toBeVisible();
      await expect(page.getByText("Rascunho em revisão.")).toBeVisible();
      await expect(page).not.toHaveURL(/\/login/);
    });

    test(`${href} abre direto, sem redirect para /login`, async ({ page }) => {
      await page.goto(href);
      await expect(page).toHaveURL(new RegExp(`${href}$`));
      await expect(page.getByText("Rascunho em revisão.")).toBeVisible();
    });
  }
});
