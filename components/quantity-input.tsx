"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Input numérico de quantidade, mobile-first (teclado decimal, alvo 44px).
// `slotEnd` recebe o botão de voz na Fase 5 sem mudar as telas.
export function QuantityInput({
  id,
  value,
  onChange,
  unit,
  invalid,
  slotEnd,
  className,
  "aria-label": ariaLabel,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  unit?: string;
  invalid?: boolean;
  slotEnd?: React.ReactNode;
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex-1">
        <Input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={value}
          aria-label={ariaLabel}
          aria-invalid={invalid || undefined}
          onChange={(e) => onChange(e.target.value)}
          className={cn("h-11 pr-14 text-base", unit ? "pr-14" : "pr-3")}
        />
        {unit && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground"
          >
            {unit}
          </span>
        )}
      </div>
      {slotEnd}
    </div>
  );
}
