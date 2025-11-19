import type { FieldValue } from 'firebase/firestore'
import type { DocId } from './Auth'
import type { OnlineStage, Result } from './Match'
import type { UserId } from './User'

export const publicMatchCollection = 'publicMatches' as const

export type PublicMatchId = DocId

export type PublicMatch = {
  publicMatchId: PublicMatchId
  createdAt: Date
  isContinuedMatch: boolean
  isElite: boolean
  globalSmashPower: number | null
  myFighterId: string
  myFighterName: string
  opponentFighterId: string
  opponentFighterName: string
  result: Result
  stage: OnlineStage | null
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
  isContinuedMatch?: PublicMatch['isContinuedMatch']
  isElite?: PublicMatch['isElite']
  globalSmashPower?: PublicMatch['globalSmashPower']
  myFighterId?: PublicMatch['myFighterId']
  myFighterName?: PublicMatch['myFighterName']
  opponentFighterId?: PublicMatch['opponentFighterId']
  opponentFighterName?: PublicMatch['opponentFighterName']
  result?: PublicMatch['result']
  stage?: PublicMatch['stage']
  updatedAt: FieldValue
}
