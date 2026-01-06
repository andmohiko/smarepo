import type { FieldValue } from 'firebase/firestore'

import type { DocId } from './Auth'

export const matchUpResultCollection = 'matchUpResults' as const

export type MatchUpResultId = DocId

export type MatchUpResult = {
  matchUpResultId: MatchUpResultId
  createdAt: Date
  loses: number
  matches: number
  myFighterId: string
  myFighterName: string
  opponentFighterId: string
  opponentFighterName: string
  updatedAt: Date
  wins: number
}

export type CreateMatchUpResultDto = Omit<
  MatchUpResult,
  'matchUpResultId' | 'createdAt' | 'updatedAt'
> & {
  createdAt: FieldValue
  updatedAt: FieldValue
}

export type UpdateMatchUpResultDto = {
  loses?: FieldValue
  matches?: FieldValue
  updatedAt: FieldValue
  wins?: FieldValue
}
