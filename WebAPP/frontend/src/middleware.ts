import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes che NON richiedono autenticazione
const publicRoutes = ['/login', '/'];

// Routes protette che richiedono autenticazione
const protectedRoutes = ['/dashboard'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Controlla se la route è protetta
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.includes(pathname);

  // Ottieni il token dai cookies o headers
  const token = request.cookies.get('auth_token')?.value;

  // Se la route è protetta e non c'è token, redirect a login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Se l'utente è autenticato e cerca di accedere al login, redirect alla dashboard
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configurazione del matcher per specificare quali route devono passare dal middleware
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
