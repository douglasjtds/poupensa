import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

export function PoupensaLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="flex size-9 items-center justify-center rounded-xl bg-accent text-accent-foreground">
        <Leaf className="size-5" aria-hidden />
      </span>
      <span className="text-2xl font-bold tracking-tight text-foreground">
        Pou<span className="text-primary">pensa</span>
      </span>
    </div>
  );
}
