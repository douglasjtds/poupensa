import type { Metadata } from "next";
import { hero } from "@/components/landing/copy";
import { Landing } from "@/components/landing/landing";

const title = `Poupensa | ${hero.h1}`;

// Sem imagem de Open Graph por enquanto; título e descrição vêm da copy da landing.
export const metadata: Metadata = {
  title,
  description: hero.sub,
  openGraph: {
    title,
    description: hero.sub,
    siteName: "Poupensa",
    locale: "pt_BR",
    type: "website",
  },
};

// Raiz: landing para visitantes. Quem está logado nem chega aqui: o proxy.ts
// redireciona para /despensa antes de renderizar.
export default function HomePage() {
  return <Landing />;
}
