import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// No Next.js 16, "Middleware" foi renomeado para "Proxy" (mesma função).
export function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
