import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export { default } from 'next-auth/middleware';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  if (token) {
    // Authenticated users should not access the sign-in, sign-up, or verify pages
    if (url.pathname.startsWith('/sign-in') || url.pathname.startsWith('/sign-up') || url.pathname.startsWith('/verify')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } else {
    // Unauthenticated users should not access the dashboard
    if (url.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/home', request.url));
    }
  }

  // Allow the request to proceed if none of the conditions match
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/dashboard/:path*',
    '/verify/:path*',
  ],
};
