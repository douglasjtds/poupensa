"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

// Fallbacks permitem build/prerender sem env configurado (ex.: CI).
// Em runtime real, configure NEXT_PUBLIC_SUPABASE_URL/ANON_KEY (.env.example).
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://localhost:54321";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "public-anon-key";

let client: ReturnType<typeof createBrowserClient<Database>> | undefined;

export function createClient() {
  client ??= createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
  return client;
}
