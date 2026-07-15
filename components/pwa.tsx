"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

// Registro do service worker + prompt de instalação (Fase 6).
//
// Android/Chrome: usa o evento beforeinstallprompt para oferecer instalação
// nativa. iOS/Safari: não existe beforeinstallprompt — mostramos uma dica de
// "Compartilhar → Adicionar à Tela de Início". Limitações do iOS documentadas
// no README (seção PWA).

const DISMISS_KEY = "poupensa.install-dismissed";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isIos(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator && (navigator as { standalone?: boolean }).standalone === true)
  );
}

export function Pwa() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY)) return;
    if (isStandalone()) return;

    if (isIos()) {
      setShowIosHint(true);
      return;
    }

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setInstallEvent(null);
    setShowIosHint(false);
  }

  async function install() {
    if (!installEvent) return;
    await installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    if (outcome === "accepted") setInstallEvent(null);
    else dismiss();
  }

  if (!installEvent && !showIosHint) return null;

  return (
    <div
      role="dialog"
      aria-label="Instalar o Poupensa"
      className="fixed inset-x-0 bottom-16 z-20 mx-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-border bg-card p-4 shadow-lg"
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-medium">Adicione o Poupensa à tela inicial</p>
          <p className="pt-1 text-sm text-muted-foreground">
            {installEvent
              ? "Acesso em um toque, como um app."
              : "No Safari: toque em Compartilhar e depois em “Adicionar à Tela de Início”."}
          </p>
          {installEvent && (
            <Button onClick={install} className="mt-3 h-11">
              Instalar
            </Button>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon-lg"
          aria-label="Dispensar sugestão de instalação"
          onClick={dismiss}
          className="size-11 shrink-0"
        >
          <X className="size-4" aria-hidden />
        </Button>
      </div>
    </div>
  );
}
