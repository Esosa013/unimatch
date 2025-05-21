import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import clientPromise from '@/lib/mongodb'
import { compare } from 'bcryptjs'

// ✅ Export authOptions so it can be imported elsewhere
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const client = await clientPromise
        const db = client.db()
        const user = await db.collection('users').findOne({ email: credentials?.email })
        if (user && (await compare(credentials!.password, user.password))) {
          return { id: user._id.toString(), email: user.email, role: user.role }
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.sub!
      session.user.role = token.role as 'student' | 'admin'
      return session
    },
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.role = (user as any).role
      }
      return token
    },
  },
}

// ✅ Use the exported options with NextAuth
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
