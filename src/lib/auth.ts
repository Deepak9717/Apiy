/**
 * lib/auth.ts
 *
 * NextAuth configuration lives here — NOT inside the API route.
 * Why? The authOptions object is also needed outside the route handler:
 * - getServerSession(authOptions) in any Server Component or API route
 *   that needs to know who's logged in server-side.
 * If it lived inside [...nextauth]/route.ts you'd get circular import
 * issues the moment you try to use getServerSession elsewhere.
 */
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email'    },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        await connectDB()

        const user = await User.findOne({ email: credentials.email.toLowerCase() })
        if (!user) throw new Error('No account found with this email')

        const valid = await bcrypt.compare(credentials.password, user.password)
        if (!valid) throw new Error('Incorrect password')

        return { id: user._id.toString(), name: user.name, email: user.email }
      },
    }),
  ],

  session: { strategy: 'jwt' },

  callbacks: {
    // Attach user.id to the JWT so it travels with every request
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    // Expose user.id on the session object available to client components
    async session({ session, token }) {
      if (token && session.user) session.user.id = token.id as string
      return session
    },
  },

  pages: {
    signIn: '/login',
    error:  '/login',
  },

  secret: process.env.NEXTAUTH_SECRET,
}
