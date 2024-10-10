import 'next-auth'
import { DefaultUser } from 'next-auth'

declare module 'next-auth' {
  interface User extends DefaultUser {
    isAdmin: boolean
  }

  interface Session {
    user: User
  }
}

declare module 'next-auth/adapters' {
  interface AdapterUser extends User {}
}