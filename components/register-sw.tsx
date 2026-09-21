"use client";

import { useEffect } from "react";

// Registra o service worker em qualquer página (instalabilidade desde a
// landing). Roda apenas em produção — em dev o SW atrapalharia o HMR.
export function RegisterSw() {
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // sem SW o app continua funcionando normalmente
      });
    }
  }, []);
  return null;
}
