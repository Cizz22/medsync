import { apiUrl } from '@/constant/env'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

export default NextAuth({
  providers: [
    Credentials({
      name: 'Sign in',
      credentials:{
        email:{ label:"Email", type:"email"},
        password:{ label:"Password", type:"password"}
      },
      authorize: async (credentials) => {
        try{
          const res = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
          })

          if (res.ok){
            const data = await res.json()
            return data
          }

          return null
        }catch(err:any){
          throw new Error(err.message)
        }
      }
    })
  ],
  session: {strategy: 'jwt'},
})
