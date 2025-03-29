import type { FieldValue } from 'firebase/firestore'

import type { UserId } from './User'
import type { DocId } from './Auth'
import type { Result } from './Match'

export const publicMatchCollection = 'publicMatches' as const

export type PublicMatchId = DocId

export type PublicMatch = {
  publicMatchId: PublicMatchId
  createdAt: Date
  isContinuedMatch: boolean
  isElite: boolean
  globalSmashPower: number
  myFighterId: string
  opponentFighterId: string
  result: Result
  updatedAt: Date
  userId: UserId
}

export type CreatePublicMatchDto = Omit<
  PublicMatch,
  'publicMatchId' | 'createdAt' | 'updatedAt'
> & {
  createdAt: FieldValue
  updatedAt: FieldValue
}

export type UpdatePublicMatchDto = {
  updatedAt: FieldValue
}
