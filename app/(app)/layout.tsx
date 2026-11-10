"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Archive, ClipboardCheck, Home, ListChecks, ShoppingCart } from "lucide-react";
import { HouseholdProvider } from "@/components/household-provider";
import { Pwa } from "@/components/pwa";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/despensa", label: "Despensa", icon: Archive },
  { href: "/compra", label: "Compra", icon: ShoppingCart },
  { href: "/conferencia", label: "Conferência", icon: ClipboardCheck },
  { href: "/lista", label: "Lista", icon: ListChecks },
  { href: "/casa", label: "Casa", icon: Home },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <HouseholdProvider>
      <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-background">
        <div className="flex-1 pb-[calc(6rem+env(safe-area-inset-bottom))]">{children}</div>
        <Pwa />
        <nav
          aria-label="Navegação principal"
          className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-card"
        >
          <div className="mx-auto flex w-full max-w-lg items-stretch justify-around pr-[max(env(safe-area-inset-right),0.75rem)] pb-[max(env(safe-area-inset-bottom),0.5rem)] pl-[max(env(safe-area-inset-left),0.75rem)]">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    // 44px+ touch target
                    "flex min-h-16 min-w-0 flex-1 flex-col items-center justify-center gap-1 text-xs font-medium",
                    active ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <Icon className="size-6" aria-hidden />
                  <span className="max-w-full truncate">{label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </HouseholdProvider>
  );
}
