import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_COOKIE = 'token';

// Routes that should only be accessible when NOT authenticated
const AUTH_PAGES = new Set<string>(['/login', '/signup']);

// Preferred post-login landing route
const DEFAULT_AFTER_LOGIN = '/classes';

function hasAuthCookie(request: NextRequest): boolean {
    const token = request.cookies.get(AUTH_COOKIE)?.value;
    console.log('Middleware: Checking auth cookie:', { 
        hasToken: Boolean(token), 
        pathname: request.nextUrl.pathname,
        cookies: request.cookies.getAll().map(c => ({ name: c.name, value: c.value ? '***' : 'undefined' }))
    });
    return Boolean(token);
}

export function middleware(request: NextRequest) {
    const { pathname, search } = request.nextUrl;

    const isAuthenticated = hasAuthCookie(request);

    // If authenticated user hits an auth page, redirect away
    if (isAuthenticated && AUTH_PAGES.has(pathname)) {
        console.log('Middleware: Redirecting authenticated user from auth page to:', DEFAULT_AFTER_LOGIN);
        const url = request.nextUrl.clone();
        url.pathname = DEFAULT_AFTER_LOGIN;
        url.search = '';
        return NextResponse.redirect(url);
    }

    // If unauthenticated user hits a protected route, redirect to login with next
    const isProtected =
        pathname.startsWith('/classes') ||
        pathname.startsWith('/agenda') ||
        pathname.startsWith('/profile') ||
        pathname.startsWith('/settings');

    if (isProtected && !isAuthenticated) {
        console.log('Middleware: Redirecting unauthenticated user to login from:', pathname);
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        const nextParam = encodeURIComponent(pathname + (search || ''));
        url.search = `?next=${nextParam}`;
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Protected areas
        '/classes/:path*',
        '/agenda/:path*',
        '/profile/:path*',
        '/settings/:path*',
        // Auth pages (to bounce authenticated users)
        '/login',
        '/signup',
    ],
};
