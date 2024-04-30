import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { apiUrl } from "@/constant/env"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials:{
        email:{},
        password:{}
      },
      authorize: async (credentials) => {
        const user = fetch(`${apiUrl}/auth/login`, {})
      }
    })
  ],
})