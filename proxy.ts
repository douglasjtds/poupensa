import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/signup", "/auth", "/privacidade", "/termos"];

// Renova a sessão Supabase (cookies) e protege rotas do app.
// A checagem de "tem household?" é client-side (HouseholdProvider) —
// aqui só garantimos autenticação. (Convenção proxy.ts do Next 16,
// sucessora do middleware.ts.)
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishableKey) return response; // env não configurado (build/CI)

  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  // Casa o segmento inteiro: "/termos" e "/termos/x", nunca "/termos-aceite".
  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  // Logado na raiz vai direto para a despensa (o PWA abre em start_url "/").
  // Os cookies renovados acima estão em `response` e precisam ir no redirect,
  // senão a sessão renovada se perde.
  if (user && pathname === "/") {
    const redirect = request.nextUrl.clone();
    redirect.pathname = "/despensa";
    const redirectResponse = NextResponse.redirect(redirect);
    response.cookies.getAll().forEach((cookie) => redirectResponse.cookies.set(cookie));
    return redirectResponse;
  }

  if (!user && !isPublic && pathname !== "/") {
    const redirect = request.nextUrl.clone();
    redirect.pathname = "/login";
    redirect.searchParams.set("next", pathname);
    return NextResponse.redirect(redirect);
  }

  return response;
}

export const config = {
  matcher: [
    // tudo exceto assets estáticos
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js|icons/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
