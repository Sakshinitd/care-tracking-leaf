import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// This middleware protects routes that should require authentication
export function middleware(request: NextRequest) {
  // List of paths that don't require authentication
  const publicPaths = [
    '/',
    '/login',
    '/api/auth/login',
    '/api/auth/callback',
    '/api/auth/logout',
    '/api/auth/me',
  ];

  // Check if the current path is in the public paths list
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname === path || 
    request.nextUrl.pathname.startsWith('/api/auth/')
  );

  // Allow access to public paths
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Check for Auth0 authentication cookie
  const isAuthenticated = request.cookies.get('auth0.is.authenticated')?.value === 'true';

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl, { status: 302 });
  }

  // Allow access to protected routes if authenticated
  return NextResponse.next();
}

// Configure middleware to run on all paths except static files
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}; 