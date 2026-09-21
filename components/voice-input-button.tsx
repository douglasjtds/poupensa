"use client";

import { Mic, Square } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useSpeechRecognition } from "@/lib/use-speech";
import { extractQuantity, formatQuantityForInput } from "@/lib/domain/voice";
import { cn } from "@/lib/utils";

// Input por voz (Web Speech API). O texto reconhecido NUNCA é salvo direto:
// ele preenche o campo editável ao lado, onde o usuário confere e corrige
// antes de submeter. Sem suporte do navegador, o botão não renderiza
// (fallback silencioso para o input manual).
export function VoiceInputButton({
  label,
  onResult,
  mode = "text",
}: {
  label: string;
  onResult: (text: string) => void;
  /** "quantity" extrai um número da fala ("dois e meio" → "2,5"). */
  mode?: "text" | "quantity";
}) {
  const { supported, listening, start, stop } = useSpeechRecognition((transcript) => {
    if (mode === "quantity") {
      const quantity = extractQuantity(transcript);
      if (quantity === null) {
        toast.error(`Não entendi uma quantidade em "${transcript}". Tente de novo ou digite.`);
        return;
      }
      onResult(formatQuantityForInput(quantity));
      toast.info(
        `Reconhecido: "${transcript}" → ${formatQuantityForInput(quantity)}. Confira antes de salvar.`
      );
    } else {
      onResult(transcript.trim());
      toast.info(`Reconhecido: "${transcript.trim()}". Confira antes de salvar.`);
    }
  });

  if (!supported) return null;

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-lg"
      aria-label={listening ? "Parar de ouvir" : label}
      aria-pressed={listening}
      onClick={listening ? stop : start}
      className={cn(
        "size-11 shrink-0",
        listening && "border-accent bg-accent/10 text-accent animate-pulse"
      )}
    >
      {listening ? (
        <Square className="size-4" aria-hidden />
      ) : (
        <Mic className="size-5" aria-hidden />
      )}
    </Button>
  );
}
