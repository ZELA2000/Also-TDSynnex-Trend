import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// MIDDLEWARE DISABLED - usando solo ProtectedRoute client-side
// Per evitare conflitti tra middleware server-side e auth context client-side

export function middleware(request: NextRequest) {
  // Pass through - la protezione delle route è gestita lato client
  return NextResponse.next();
}

// Configurazione del matcher - solo per _next
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
