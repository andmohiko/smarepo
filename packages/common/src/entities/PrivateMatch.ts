import type { FieldValue } from 'firebase/firestore'

import type { UserId } from './User'
import type { DocId } from './Auth'
import type { Result } from './Match'

export const privateMatchCollection = 'privateMatches' as const

export type PrivateMatchId = DocId

export type PrivateMatch = {
  privateMatchId: PrivateMatchId
  createdAt: Date
  isElite: boolean
  myFighterId: string
  opponentFighterId: string
  opponentName: string
  result: Result
  updatedAt: Date
  userId: UserId
}

export type CreatePrivateMatchDto = Omit<
  PrivateMatch,
  'privateMatchId' | 'createdAt' | 'updatedAt'
> & {
  createdAt: FieldValue
  updatedAt: FieldValue
}

export type UpdatePrivateMatchDto = {
  updatedAt: FieldValue
}
