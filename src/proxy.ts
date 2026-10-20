/**
 * proxy.ts
 *
 * Runs before protected application requests. withAuth checks for a valid
 * JWT session token and redirects unauthenticated users to /login.
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
    '/((?!login|signup|api/auth|_next/static|_next/image|favicon.ico|logo.png).*)',
  ],
}
