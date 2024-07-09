// next-auth.d.ts
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      companyExists?: boolean
      authToken?: string  // Add this line
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    companyExists?: boolean
    token?: string  // Add this line
  }

  interface JWT {
    id: string
    name?: string | null
    email?: string | null
    picture?: string | null
    companyExists?: boolean
    authToken?: string  // Add this line
  }
}