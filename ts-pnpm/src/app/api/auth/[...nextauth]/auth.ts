import NextAuth, { type DefaultSession } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

import { apiUrl } from '@/constant/env'
import { JWT } from "next-auth/jwt"
interface UserResp {
  email: string,
  name: string,
  neosync_account_id: string,
  accessToken: string,
  tokenExpires: string
}

// The `JWT` interface can be found in the `next-auth/jwt` submodule


declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    neosync_account_id: string,
    accessToken: string,
    tokenExpires: string,
    refresh_token: string,
  }
}

declare module "next-auth" {
  interface User {
    neosync_account_id: string,
    accessToken: string,
    tokenExpires: string,
    refresh_token: string,
  }

  interface Session {
    user: {
      neosync_account_id: string,
      accessToken: string,
      refresh_token: string,
      tokenExpires: string
    } & DefaultSession["user"]
  }

}

export const {
  handlers,
  auth,
  signIn,
  signOut
} = NextAuth({
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: {},
        password: {}
      },
      authorize: async (credentials) => {
        // eslint-disable-next-line no-console
        try {
          const res = await fetch(`${apiUrl}/v1/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          })

          if (!res.ok) {
            return null
          }

          const data = await res.json()
          // eslint-disable-next-line no-console
          return {
            email: data.user.email,
            name: data.user.name,
            id: data.user.neosync_account_id,
            accessToken: data.tokens.access.token,
            tokenExpires: data.tokens.access.expires,
            refreshToken: data.tokens.refresh.token
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          throw new Error(err)
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name
        token.email = user.email
        token.neosync_account_id = user.id
        token.accessToken = user.accessToken
        token.refresh_token = user.refreshToken
      }

      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user.neosync_account_id = token.neosync_account_id
        session.user.name = token.name
        session.user.email = token?.email
        session.user.accessToken = token.accessToken
        session.user.refresh_token = token.refresh_token
      }

      return session
    }
  },
})
