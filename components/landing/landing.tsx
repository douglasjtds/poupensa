import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowDown,
  Calculator,
  CalendarX2,
  ChevronDown,
  ListChecks,
  Mic,
  Users,
  type LucideIcon,
} from "lucide-react";
import { PoupensaLogo } from "@/components/poupensa-logo";
import { CheckDemo } from "@/components/landing/check-demo";
import {
  faq,
  features,
  finalCta,
  footer,
  formatQuantity,
  header,
  hero,
  heroList,
  howItWorks,
  problem,
  solution,
  type FeatureId,
  type StepExample,
} from "@/components/landing/copy";
import {
  NAME_CLASS,
  QUANTITY_CLASS,
  SKIP_CLASS,
  STRUCK_CLASS,
} from "@/components/landing/line-classes";
import { nextPurchase } from "@/lib/landing-example";
import { cn } from "@/lib/utils";
import "./landing.css";

const HOW_IT_WORKS_HREF = "#como-funciona";

const WRAP = "mx-auto w-full max-w-[1440px] px-5 md:px-10 xl:px-14";
const H2 = "text-[32px] leading-[1.08] font-bold tracking-[-0.03em] text-balance lg:text-[56px]";
const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
const TEXT_LINK = cn("inline-flex min-h-11 items-center underline-offset-4 hover:underline", FOCUS);
const CTA = cn(
  "inline-flex h-[54px] items-center justify-center rounded-[10px] bg-primary px-8 text-[17px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover",
  FOCUS
);

// Indexado pelo id: o tipo obriga um ícone para cada feature, em qualquer ordem.
const FEATURE_ICONS: Record<FeatureId, LucideIcon> = {
  "shared-pantry": Users,
  "auto-calc": Calculator,
  voice: Mic,
  "list-control": ListChecks,
  depletion: CalendarX2,
};

// Server Component; só a demo (CheckDemo) roda no cliente.
export function Landing() {
  return (
    <div className="lp flex min-h-dvh flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Problem />
        <Solution />
        <HowItWorks />
        <Features />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}

function SiteHeader() {
  return (
    <header
      className={cn(WRAP, "flex items-center justify-between gap-4 py-2 whitespace-nowrap lg:py-4")}
    >
      <Link
        href="/"
        aria-label={header.logoLabel}
        className={cn("inline-flex min-h-11 items-center rounded-[10px]", FOCUS)}
      >
        <PoupensaLogo />
      </Link>
      <nav className="flex items-center gap-6 text-sm font-semibold lg:text-base">
        <a href={HOW_IT_WORKS_HREF} className={cn(TEXT_LINK, "hidden lg:inline-flex")}>
          {header.howItWorks}
        </a>
        <Link href="/login" className={cn(TEXT_LINK, "px-1 text-primary")}>
          {header.login}
        </Link>
        <Link href="/signup" className={cn(CTA, "hidden h-11 px-5 text-base lg:inline-flex")}>
          {header.cta}
        </Link>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className={cn(WRAP, "flex flex-col gap-4 pt-2 pb-10 lg:gap-6 lg:pt-6 lg:pb-16")}>
      <h1 className="text-[44px] leading-none font-bold tracking-[-0.035em] text-balance lg:text-[clamp(56px,5.5vw,84px)]">
        {hero.h1}
      </h1>

      {/* A tagline não diz o que o app faz; a sub diz, e prepara a leitura dos riscos.
          Em celulares baixos ela desce para depois da oferta, para o CTA não sair da dobra. */}
      <p className="text-base leading-snug text-pretty max-lg:[@media(max-height:720px)]:order-last lg:max-w-[62ch] lg:text-xl">
        {hero.sub}
      </p>

      <HeroList />

      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-6">
        <Link
          href="/signup"
          className={cn(CTA, "sm:self-start lg:h-[60px] lg:self-auto lg:px-12 lg:text-lg")}
        >
          {hero.ctaPrimary}
        </Link>
        <p className="text-center text-[13px] text-balance text-muted-foreground sm:text-left lg:text-base">
          {hero.offer}
        </p>
        <a
          href={HOW_IT_WORKS_HREF}
          className={cn(
            TEXT_LINK,
            "justify-center gap-1.5 text-sm font-semibold sm:self-start lg:ml-auto lg:self-auto"
          )}
        >
          {hero.ctaSecondary}
          <ArrowDown className="size-4" aria-hidden />
        </a>
      </div>
    </section>
  );
}

function HeroList() {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 pb-2">
        <h2 className="text-sm font-semibold lg:text-base">{heroList.title}</h2>
        <span className="lp-chip">{heroList.exampleLabel}</span>
      </div>
      <ul className="border-b border-border">
        {heroList.items.map((item) => {
          const next = nextPurchase(item.bought, item.left);
          return (
            <li
              key={item.name}
              className="grid border-t border-border py-2 lg:grid-cols-[1fr_1.25fr_1fr] lg:items-center lg:gap-x-8 lg:py-3"
            >
              <div>
                <p className={STRUCK_CLASS}>
                  <s className="lp-strike lp-strike-draw">{item.guess}</s>
                </p>
                <p className="hidden pt-1 text-sm text-muted-foreground lg:block">
                  {heroList.labels.bought}{" "}
                  <span className="font-mono">{formatQuantity(item.bought, item.unit)}</span>
                  {" · "}
                  {heroList.labels.left}{" "}
                  <span className="font-mono">{formatQuantity(item.left, item.unit)}</span>
                </p>
              </div>
              <p className="flex items-baseline justify-between gap-2 lg:contents">
                <span className={NAME_CLASS}>{item.name}</span>
                {next > 0 ? (
                  <span className={QUANTITY_CLASS}>{formatQuantity(next, item.unit)}</span>
                ) : (
                  <span className={SKIP_CLASS}>{heroList.skipLabel}</span>
                )}
              </p>
            </li>
          );
        })}
      </ul>
      <p className="hidden pt-2 text-sm text-muted-foreground lg:block">{heroList.note}</p>
    </div>
  );
}

/** Cada frase do título em sua própria linha, sem alterar o texto. */
function Sentences({ text, lastClassName }: { text: string; lastClassName?: string }) {
  const sentences = text.split(/(?<=\.)\s/);
  return sentences.map((sentence, index) => (
    <span key={sentence} className={cn("block", index === sentences.length - 1 && lastClassName)}>
      {sentence}{" "}
    </span>
  ));
}

function Problem() {
  return (
    <section className={cn(WRAP, "py-14 lg:py-28")}>
      <h2 className={cn(H2, "lg:text-[72px]")}>
        <Sentences text={problem.title} />
      </h2>
      <ul className="mt-8 border-b border-border lg:mt-14">
        {problem.items.map((item) => (
          <li
            key={item.text}
            className="grid gap-y-1 border-t border-border py-4 lg:grid-cols-[1fr_1.25fr_1fr] lg:items-baseline lg:gap-x-8 lg:py-7"
          >
            <p className={STRUCK_CLASS}>
              <s className="lp-strike">{item.guess}</s>
            </p>
            <p className="text-[22px] leading-[1.2] font-medium tracking-[-0.02em] text-pretty lg:col-span-2 lg:text-[36px]">
              {item.text}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Solution() {
  return (
    <section className="border-y border-border bg-card">
      <div className={cn(WRAP, "grid lg:grid-cols-12")}>
        <div className="flex flex-col gap-5 py-14 lg:col-span-5 lg:py-24 lg:pr-14">
          <h2 className={H2}>{solution.title}</h2>
          <p className="max-w-[60ch] text-lg leading-normal text-pretty">{solution.body}</p>
          <p className="border-t border-border pt-4 text-lg leading-snug font-medium text-pretty lg:mt-auto">
            {solution.origin}
          </p>
        </div>
        <div className="border-t border-border py-10 lg:col-span-7 lg:border-t-0 lg:border-l lg:py-24 lg:pl-14">
          <CheckDemo className="lp-demo" />
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="como-funciona" className={cn(WRAP, "scroll-mt-4 py-14 lg:py-28")}>
      <h2 className={H2}>
        <Sentences text={howItWorks.title} lastClassName="text-accent-hover" />
      </h2>
      {/* Os dois registros compartilham um fio contínuo e escuro; o passo 3 sai desse fio
          porque é o que o app calcula. Só o resultado dele vai em lilás e mono. */}
      <div className="mt-8 flex justify-end pb-2 lg:mt-14">
        <span className="lp-chip">{heroList.exampleLabel}</span>
      </div>
      <ol className="grid lg:grid-cols-3">
        {howItWorks.steps.map((step, index) => (
          <li
            key={step.title}
            className={cn(
              "flex flex-col border-t-2 py-5 lg:py-6 lg:not-first:border-l lg:not-first:border-l-border lg:not-first:pl-8 lg:not-last:pr-8",
              step.example.value === null ? "border-t-border" : "border-t-foreground"
            )}
          >
            <div className="flex items-baseline gap-3">
              <span className="text-[28px] leading-none font-semibold tracking-[-0.03em] tabular-nums lg:text-[36px]">
                {index + 1}
              </span>
              <h3 className="text-[22px] leading-tight font-semibold tracking-[-0.02em] lg:text-[clamp(20px,1.7vw,26px)]">
                {step.title}
              </h3>
            </div>
            <p className="mt-2 mb-4 max-w-[42ch] flex-1 text-muted-foreground lg:mb-6 lg:text-lg">
              {step.text}
            </p>
            <StepExampleRow example={step.example} />
          </li>
        ))}
      </ol>
      <p className="mt-4 border-t border-border pt-5 text-[22px] leading-tight font-medium tracking-[-0.02em] lg:mt-6 lg:text-[28px]">
        {howItWorks.support}
      </p>
    </section>
  );
}

function StepExampleRow({ example }: { example: StepExample }) {
  const rice = heroList.items[0];
  const calculated = example.value ?? nextPurchase(rice.bought, rice.left);
  return (
    <dl className="flex items-baseline justify-between gap-3 border-t border-border pt-2 lg:pt-3">
      <dt className="text-sm text-muted-foreground lg:text-base">
        <span className="font-medium text-foreground">{rice.name}</span>
        {" · "}
        {example.label}
      </dt>
      <dd
        className={cn(
          "font-mono text-lg font-medium tracking-[-0.03em] whitespace-nowrap [word-spacing:-0.3em] lg:text-[22px]",
          example.value === null && "text-accent-hover"
        )}
      >
        {calculated > 0 ? formatQuantity(calculated, example.unit) : heroList.skipLabel}
      </dd>
    </dl>
  );
}

function Features() {
  const [first, second, ...rest] = features.items;
  return (
    <section className={cn(WRAP, "pb-14 lg:pb-28")}>
      <h2 className={H2}>{features.title}</h2>
      <ul className="mt-8 grid border-b border-border lg:mt-14 lg:grid-cols-12">
        <FeatureLarge
          {...first}
          Icon={FEATURE_ICONS[first.id]}
          className="lg:col-span-7 lg:pr-14"
        />
        <FeatureLarge
          {...second}
          Icon={FEATURE_ICONS[second.id]}
          className="lg:col-span-5 lg:border-l lg:pl-8"
        />
        {rest.map((feature) => {
          const Icon = FEATURE_ICONS[feature.id];
          return (
            <li
              key={feature.id}
              className="grid grid-cols-[1.5rem_1fr] gap-x-3 border-t border-border py-4 lg:col-span-12 lg:grid-cols-subgrid lg:items-baseline lg:gap-x-0"
            >
              <span className="flex items-baseline gap-3 max-lg:contents lg:col-span-7 lg:pr-14">
                <Icon
                  className="mt-0.5 size-5 shrink-0 self-center text-accent-hover"
                  aria-hidden
                />
                <h3 className="text-lg leading-snug font-semibold tracking-[-0.01em] lg:text-[22px]">
                  {feature.title}
                </h3>
              </span>
              <p className="col-start-2 max-w-[60ch] text-muted-foreground lg:col-span-5 lg:pl-8">
                {feature.text}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function FeatureLarge({
  title,
  text,
  Icon,
  className,
}: {
  title: string;
  text: string;
  Icon: LucideIcon;
  className?: string;
}) {
  return (
    <li className={cn("border-t border-border py-6 lg:pt-8 lg:pb-14", className)}>
      <Icon className="size-7 text-accent-hover" aria-hidden />
      <h3 className="mt-3 text-[30px] leading-[1.08] font-semibold tracking-[-0.03em] lg:mt-5 lg:text-[44px]">
        {title}
      </h3>
      <p className="mt-2 max-w-[44ch] text-lg leading-normal text-muted-foreground lg:mt-3">
        {text}
      </p>
    </li>
  );
}

function Faq() {
  return (
    <section className="border-t border-border bg-card">
      <div className={cn(WRAP, "grid gap-8 py-14 lg:grid-cols-12 lg:py-24")}>
        <h2 className={cn(H2, "lg:col-span-4")}>{faq.title}</h2>
        <div className="border-b border-border lg:col-span-8">
          {faq.items.map((item) => (
            <details key={item.question} className="group border-t border-border">
              <summary
                className={cn(
                  "flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 text-lg leading-snug font-medium hover:text-primary lg:min-h-16 lg:text-[22px] [&::-webkit-details-marker]:hidden",
                  FOCUS
                )}
              >
                {item.question}
                <ChevronDown
                  className="size-5 shrink-0 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
                  aria-hidden
                />
              </summary>
              <p className="max-w-[65ch] pr-9 pb-5 text-pretty text-muted-foreground lg:text-lg">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className={cn(WRAP, "flex flex-col items-center gap-6 py-20 text-center lg:py-32")}>
        <h2 className="text-[44px] leading-none font-bold tracking-[-0.035em] text-balance lg:text-[88px]">
          {finalCta.title}
        </h2>
        <Link
          href="/signup"
          className="inline-flex h-[54px] w-full items-center justify-center rounded-[10px] bg-card px-10 text-[17px] font-semibold text-primary transition-colors hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground sm:w-auto lg:h-[60px] lg:px-12 lg:text-lg"
        >
          {finalCta.cta}
        </Link>
        <p className="text-sm text-balance lg:text-base">{finalCta.support}</p>
      </div>
    </section>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return href.startsWith("#") ? (
    <a href={href} className={TEXT_LINK}>
      {children}
    </a>
  ) : (
    <Link href={href} className={TEXT_LINK}>
      {children}
    </Link>
  );
}

function SiteFooter() {
  return (
    <footer>
      <div
        className={cn(
          WRAP,
          "flex flex-col gap-3 py-8 lg:flex-row lg:items-center lg:justify-between"
        )}
      >
        <PoupensaLogo />
        <nav className="flex flex-wrap gap-x-6 text-sm">
          <FooterLink href={HOW_IT_WORKS_HREF}>{footer.howItWorks}</FooterLink>
          <FooterLink href="/privacidade">{footer.privacy}</FooterLink>
          <FooterLink href="/termos">{footer.terms}</FooterLink>
        </nav>
        <p className="text-sm text-muted-foreground">{footer.copyright}</p>
      </div>
    </footer>
  );
}
