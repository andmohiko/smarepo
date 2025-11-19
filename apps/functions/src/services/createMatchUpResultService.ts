import type {
  CreateMatchUpResultDto,
  MatchUpResult,
  PublicMatch,
  UpdateMatchUpResultDto,
} from '@smarepo/common'
import { FieldValue } from 'firebase-admin/firestore'
import {
  createMatchUpResultOperation,
  fetchMatchUpResultFromFightersOperation,
  updateMatchUpResultOperation,
} from '~/infrastructure/firestore/MatchUpResultOperations'
import { serverTimestamp } from '~/lib/firebase'

export const saveMatchUpResult = async (publicMatch: PublicMatch) => {
  // 作成された戦績からマッチアップ結果を取得
  const matchUpResult = await fetchMatchUpResultFromFightersOperation(
    publicMatch.userId,
    publicMatch.myFighterId,
    publicMatch.opponentFighterId,
  )
  if (!matchUpResult) {
    await createMatchUpResult(publicMatch)
    return
  }
  await updateMatchUpResult(matchUpResult, publicMatch)
  return
}

const updateMatchUpResult = async (
  matchUpResult: MatchUpResult,
  publicMatch: PublicMatch,
) => {
  // マッチアップ結果を更新
  const dto: UpdateMatchUpResultDto =
    publicMatch.result === 'WIN'
      ? {
          wins: FieldValue.increment(1),
          matches: FieldValue.increment(1),
          updatedAt: serverTimestamp,
        }
      : {
          loses: FieldValue.increment(1),
          matches: FieldValue.increment(1),
          updatedAt: serverTimestamp,
        }
  await updateMatchUpResultOperation(
    publicMatch.userId,
    matchUpResult.matchUpResultId,
    dto,
  )
}

const createMatchUpResult = async (publicMatch: PublicMatch) => {
  const baseDto: CreateMatchUpResultDto = {
    createdAt: serverTimestamp,
    loses: 0,
    matches: 1,
    myFighterId: publicMatch.myFighterId,
    opponentFighterId: publicMatch.opponentFighterId,
    updatedAt: serverTimestamp,
    wins: 0,
  }
  const dto =
    publicMatch.result === 'WIN'
      ? { ...baseDto, wins: 1 }
      : { ...baseDto, loses: 1 }
  await createMatchUpResultOperation(publicMatch.userId, dto)
}
