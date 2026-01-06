import type {
  CreateMatchUpResultDto,
  MatchUpResult,
  PublicMatch,
  UpdateMatchUpResultDto,
} from '@smarepo/common'
import { FieldValue, type WriteBatch } from 'firebase-admin/firestore'
import {
  createMatchUpResultByBatchOperation,
  fetchMatchUpResultFromFightersOperation,
  updateMatchUpResultByBatchOperation,
} from '~/infrastructure/firestore/MatchUpResultOperations'
import { db, serverTimestamp } from '~/lib/firebase'

export const saveMatchUpResult = async (
  previousPublicMatch: PublicMatch,
  newPublicMatch: PublicMatch,
) => {
  const batch = db.batch()
  // 更新前のマッチアップ結果をリバートする
  const previousMatchUpResult = await fetchMatchUpResultFromFightersOperation(
    previousPublicMatch.userId,
    previousPublicMatch.myFighterId,
    previousPublicMatch.opponentFighterId,
  )
  if (!previousMatchUpResult) {
    throw new Error('マッチアップデータが存在しません')
  }
  revertMatchUpResult(batch, previousMatchUpResult, previousPublicMatch)

  // 作成された戦績からマッチアップ結果を取得
  const matchUpResult = await fetchMatchUpResultFromFightersOperation(
    newPublicMatch.userId,
    newPublicMatch.myFighterId,
    newPublicMatch.opponentFighterId,
  )
  // 更新後のマッチアップ結果を保存
  if (!matchUpResult) {
    createMatchUpResult(batch, newPublicMatch)
    await batch.commit()
    return
  }
  updateMatchUpResult(batch, matchUpResult, newPublicMatch)
  await batch.commit()
  return
}

const updateMatchUpResult = (
  batch: WriteBatch,
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
  updateMatchUpResultByBatchOperation(
    batch,
    publicMatch.userId,
    matchUpResult.matchUpResultId,
    dto,
  )
}

const createMatchUpResult = (batch: WriteBatch, publicMatch: PublicMatch) => {
  const baseDto: CreateMatchUpResultDto = {
    createdAt: serverTimestamp,
    loses: 0,
    matches: 1,
    myFighterId: publicMatch.myFighterId,
    myFighterName: publicMatch.myFighterName,
    opponentFighterId: publicMatch.opponentFighterId,
    opponentFighterName: publicMatch.opponentFighterName,
    updatedAt: serverTimestamp,
    wins: 0,
  }
  const dto =
    publicMatch.result === 'WIN'
      ? { ...baseDto, wins: 1 }
      : { ...baseDto, loses: 1 }
  createMatchUpResultByBatchOperation(batch, publicMatch.userId, dto)
}

const revertMatchUpResult = (
  batch: WriteBatch,
  previousMatchUpResult: MatchUpResult,
  previousPublicMatch: PublicMatch,
) => {
  const dto: UpdateMatchUpResultDto =
    previousPublicMatch.result === 'WIN'
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
  updateMatchUpResultByBatchOperation(
    batch,
    previousPublicMatch.userId,
    previousMatchUpResult.matchUpResultId,
    dto,
  )
}
