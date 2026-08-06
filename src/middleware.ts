import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login',
    },
  }
)

// Protect all routes except auth pages and API routes
export const config = {
  matcher: [
    '/((?!login|signup|api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}
