// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Next.js allows us to easily read cookies server-side
    const token = request.cookies.get('token')?.value;

    // Protect all routes that start with /dashboard
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        if (!token) {
            // Redirect to the login page if they don't have a token
            const loginUrl = new URL('/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

// Tell Next.js exactly which paths this middleware should run on
export const config = {
    matcher: ['/dashboard/:path*'],
};
