import type {
  MatchUpResult,
  PublicMatch,
  UpdateMatchUpResultDto,
} from '@smarepo/common'
import { FieldValue } from 'firebase-admin/firestore'
import {
  fetchMatchUpResultFromFightersOperation,
  updateMatchUpResultOperation,
} from '~/infrastructure/firestore/MatchUpResultOperations'
import { serverTimestamp } from '~/lib/firebase'

export const revertMatchUpResultForDelete = async (
  publicMatch: PublicMatch,
) => {
  // 削除された戦績からマッチアップ結果を取得
  const matchUpResult = await fetchMatchUpResultFromFightersOperation(
    publicMatch.userId,
    publicMatch.myFighterId,
    publicMatch.opponentFighterId,
  )
  
  if (!matchUpResult) {
    throw new Error('マッチアップデータが存在しません')
  }

  await revertMatchUpResult(matchUpResult, publicMatch)
}

const revertMatchUpResult = async (
  matchUpResult: MatchUpResult,
  publicMatch: PublicMatch,
) => {
  // マッチアップ結果をリバート（勝敗数と試合数をデクリメント）
  const dto: UpdateMatchUpResultDto =
    publicMatch.result === 'WIN'
      ? {
          wins: FieldValue.increment(-1),
          matches: FieldValue.increment(-1),
          updatedAt: serverTimestamp,
        }
      : {
          loses: FieldValue.increment(-1),
          matches: FieldValue.increment(-1),
          updatedAt: serverTimestamp,
        }
  
  await updateMatchUpResultOperation(
    publicMatch.userId,
    matchUpResult.matchUpResultId,
    dto,
  )
}
