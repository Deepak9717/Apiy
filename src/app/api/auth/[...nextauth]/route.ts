import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/features/auth/server/mongodb'
import User from '@/features/auth/server/User'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required')
        }

        await connectDB()

        const user = await User.findOne({ email: credentials.email.toLowerCase() })
        if (!user) throw new Error('No account found with this email')

        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) throw new Error('Incorrect password')

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        }
      },
    }),
  ],

  session: { strategy: 'jwt' },

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
