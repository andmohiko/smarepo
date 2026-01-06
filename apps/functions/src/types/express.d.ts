import type { DecodedIdToken } from 'firebase-admin/auth'

declare module 'express' {
  import type { Request } from 'express'

  export type LoggedInRequest = {
    currentUser: DecodedIdToken
  } & Request
}
