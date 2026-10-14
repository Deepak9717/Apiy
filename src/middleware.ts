/**
 * middleware.ts
 *
 * Runs on the Edge before every request.
 * withAuth checks for a valid JWT session token.
 * If none → redirect to /login.
 *
 * The matcher excludes:
 *  - /login, /signup         public auth pages
 *  - /api/auth/*             NextAuth's own endpoints (must stay public)
 *  - /_next/*, /favicon.ico  Next.js internals
 */
import { withAuth } from 'next-auth/middleware'

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
  pages: {
    signIn: '/login',
  },
})

export const config = {
  matcher: [
    '/((?!login|signup|api/auth|_next/static|_next/image|favicon.ico|icon.svg).*)',
  ],
}
