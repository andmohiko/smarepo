import {
  type MatchUpResult,
  matchUpResultCollection,
  type PublicMatch,
  publicMatchCollection,
  type Result,
  userCollection,
} from '@smarepo/common'
import { Timestamp } from 'firebase-admin/firestore'
import {
  clearCollection,
  deleteFirebaseApp,
  initializeFirebaseApp,
} from 'test/config/firestore'
import { afterAll, beforeAll, beforeEach, describe, test } from 'vitest'
import { revertMatchUpResultForDelete } from '~/services/deleteMatchUpResultService'

let db: FirebaseFirestore.Firestore

beforeAll(async () => {
  const { db: firestore } = initializeFirebaseApp()
  db = firestore
})

beforeEach(async () => {
  await clearCollection(db, publicMatchCollection)
  await clearCollection(db, userCollection, matchUpResultCollection)
  await clearCollection(db, userCollection)
})

afterAll(async () => {
  await clearCollection(db, publicMatchCollection)
  await clearCollection(db, userCollection, matchUpResultCollection)
  await clearCollection(db, userCollection)
  deleteFirebaseApp()
})

const userId = 'testUserId' as const
const userData = {
  email: 'test@example.com',
}
const publicMatchId = 'testPublicMatchId' as const
const basePublicMatchData: Omit<PublicMatch, 'publicMatchId' | 'result'> = {
  createdAt: new Date(),
  isContinuedMatch: false,
  isElite: false,
  globalSmashPower: null,
  myFighterId: '01',
  myFighterName: 'マリオ',
  opponentFighterId: '02',
  opponentFighterName: 'ドンキーコング',
  stage: 'BATTLEFIELD',
  updatedAt: new Date(),
  userId: userId,
}
const matchUpResultId = 'testMatchUpResultId' as const
const baseMatchUpResultData: Omit<MatchUpResult, 'matchUpResultId'> = {
  createdAt: new Date(),
  loses: 2,
  matches: 6,
  myFighterId: '01',
  myFighterName: 'マリオ',
  opponentFighterId: '02',
  opponentFighterName: 'ドンキーコング',
  updatedAt: new Date(),
  wins: 4,
}

describe('deleteMatchUpResult', () => {
  describe('マッチアップ結果をリバートするとき', async () => {
    test('勝った試合を削除したとき', async () => {
      // ユーザーデータを作成
      await db.collection(userCollection).doc(userId).set(userData)
      // 既存マッチアップデータを作成
      await db
        .collection(userCollection)
        .doc(userId)
        .collection(matchUpResultCollection)
        .doc(matchUpResultId)
        .set(baseMatchUpResultData)

      // 削除された戦績データ（勝ち）
      const publicMatchData = {
        ...basePublicMatchData,
        result: 'WIN' as Result,
      }
      // マッチアップ結果をリバート
      await revertMatchUpResultForDelete({
        ...publicMatchData,
        publicMatchId,
      })

      // マッチアップ結果を検証
      const snap = await db
        .collection(userCollection)
        .doc(userId)
        .collection(matchUpResultCollection)
        .get()
      expect(snap.size).toBe(1)
      const revertedMatchUpResult = snap.docs[0].data() as MatchUpResult

      expect(revertedMatchUpResult.createdAt instanceof Timestamp).toBe(true)
      expect(revertedMatchUpResult.loses).toBe(2)
      expect(revertedMatchUpResult.matches).toBe(5)
      expect(revertedMatchUpResult.myFighterId).toBe('01')
      expect(revertedMatchUpResult.myFighterName).toBe('マリオ')
      expect(revertedMatchUpResult.opponentFighterId).toBe('02')
      expect(revertedMatchUpResult.opponentFighterName).toBe('ドンキーコング')
      expect(revertedMatchUpResult.updatedAt instanceof Timestamp).toBe(true)
      expect(revertedMatchUpResult.wins).toBe(3)
    })

    test('負けた試合を削除したとき', async () => {
      // ユーザーデータを作成
      await db.collection(userCollection).doc(userId).set(userData)
      // 既存マッチアップデータを作成
      await db
        .collection(userCollection)
        .doc(userId)
        .collection(matchUpResultCollection)
        .doc(matchUpResultId)
        .set(baseMatchUpResultData)

      // 削除された戦績データ（負け）
      const publicMatchData = {
        ...basePublicMatchData,
        result: 'LOSE' as Result,
      }
      // マッチアップ結果をリバート
      await revertMatchUpResultForDelete({
        ...publicMatchData,
        publicMatchId,
      })

      // マッチアップ結果を検証
      const snap = await db
        .collection(userCollection)
        .doc(userId)
        .collection(matchUpResultCollection)
        .get()
      expect(snap.size).toBe(1)
      const revertedMatchUpResult = snap.docs[0].data() as MatchUpResult

      expect(revertedMatchUpResult.createdAt instanceof Timestamp).toBe(true)
      expect(revertedMatchUpResult.loses).toBe(1)
      expect(revertedMatchUpResult.matches).toBe(5)
      expect(revertedMatchUpResult.myFighterId).toBe('01')
      expect(revertedMatchUpResult.myFighterName).toBe('マリオ')
      expect(revertedMatchUpResult.opponentFighterId).toBe('02')
      expect(revertedMatchUpResult.opponentFighterName).toBe('ドンキーコング')
      expect(revertedMatchUpResult.updatedAt instanceof Timestamp).toBe(true)
      expect(revertedMatchUpResult.wins).toBe(4)
    })
  })

  describe('マッチアップデータが存在しないとき', async () => {
    test('エラーをスローする', async () => {
      // ユーザーデータを作成
      await db.collection(userCollection).doc(userId).set(userData)
      // マッチアップデータは作成しない

      // 削除された戦績データ（勝ち）
      const publicMatchData = {
        ...basePublicMatchData,
        result: 'WIN' as Result,
      }

      // マッチアップ結果をリバートしようとするとエラーがスローされる
      await expect(
        revertMatchUpResultForDelete({
          ...publicMatchData,
          publicMatchId,
        }),
      ).rejects.toThrow('マッチアップデータが存在しません')
    })
  })
})
