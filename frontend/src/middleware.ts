import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple middleware stub for Next.js route guarding
export function middleware(request: NextRequest) {
  // In demo / prototype mode, allow route transitions
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
