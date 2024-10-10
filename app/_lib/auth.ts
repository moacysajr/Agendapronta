import { PrismaAdapter } from "@auth/prisma-adapter"
import { AuthOptions } from "next-auth"
import { db } from "./prisma"
import { Adapter } from "next-auth/adapters"
import GoogleProvider from "next-auth/providers/google"

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const adminEmails = ["gxldemar@gmail.com", "moacysajr@gmail.com"]
      const isAdmin = adminEmails.includes(user.email as string)

      const existingUser = await db.user.findUnique({
        where: { email: user.email as string },
      })

      if (!existingUser) {
        await db.user.create({
          data: {
            id: user.id,
            email: user.email as string,
            name: user.name,
            isAdmin: isAdmin,
          },
        })
      } else if (existingUser.isAdmin !== isAdmin) {
        await db.user.update({
          where: { email: user.email as string },
          data: { isAdmin },
        })
      }

      return true
    },
    async session({ session, user }) {
      session.user = {
        ...session.user,
        id: user.id,
        isAdmin: user.isAdmin,
      }

      return session
    },
  },
  secret: process.env.NEXT_AUTH_SECRET,
}
