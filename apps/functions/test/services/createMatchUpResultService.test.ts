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
import { saveMatchUpResult } from '~/services/createMatchUpResultService'

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
  loses: 1,
  matches: 5,
  myFighterId: '01',
  myFighterName: 'マリオ',
  opponentFighterId: '02',
  opponentFighterName: 'ドンキーコング',
  updatedAt: new Date(),
  wins: 4,
}

describe('createMatchUpResult', () => {
  describe('マッチアップ結果を更新するとき', async () => {
    test('勝ったとき', async () => {
      // ユーザーデータを作成
      await db.collection(userCollection).doc(userId).set(userData)
      // 既存マッチアップデータを作成
      await db
        .collection(userCollection)
        .doc(userId)
        .collection(matchUpResultCollection)
        .doc(matchUpResultId)
        .set(baseMatchUpResultData)

      // 今回作成された戦績データ（勝ち）
      const publicMatchData = {
        ...basePublicMatchData,
        result: 'WIN' as Result,
      }
      // マッチアップ結果を更新
      await saveMatchUpResult({ ...publicMatchData, publicMatchId })

      // マッチアップ結果を検証
      const snap = await db
        .collection(userCollection)
        .doc(userId)
        .collection(matchUpResultCollection)
        .get()
      expect(snap.size).toBe(1)
      const updatedMatchUpResult = snap.docs[0].data() as MatchUpResult

      expect(updatedMatchUpResult.createdAt instanceof Timestamp).toBe(true)
      expect(updatedMatchUpResult.loses).toBe(1)
      expect(updatedMatchUpResult.matches).toBe(6)
      expect(updatedMatchUpResult.myFighterId).toBe('01')
      expect(updatedMatchUpResult.myFighterName).toBe('マリオ')
      expect(updatedMatchUpResult.opponentFighterId).toBe('02')
      expect(updatedMatchUpResult.opponentFighterName).toBe('ドンキーコング')
      expect(updatedMatchUpResult.updatedAt instanceof Timestamp).toBe(true)
      expect(updatedMatchUpResult.wins).toBe(5)
    })

    test('負けたとき', async () => {
      // ユーザーデータを作成
      await db.collection(userCollection).doc(userId).set(userData)
      // 既存マッチアップデータを作成
      await db
        .collection(userCollection)
        .doc(userId)
        .collection(matchUpResultCollection)
        .doc(matchUpResultId)
        .set(baseMatchUpResultData)

      // 今回作成された戦績データ（負け）
      const publicMatchData = {
        ...basePublicMatchData,
        result: 'LOSE' as Result,
      }
      // マッチアップ結果を更新
      await saveMatchUpResult({ ...publicMatchData, publicMatchId })

      // マッチアップ結果を検証
      const snap = await db
        .collection(userCollection)
        .doc(userId)
        .collection(matchUpResultCollection)
        .get()
      expect(snap.size).toBe(1)
      const updatedMatchUpResult = snap.docs[0].data() as MatchUpResult

      expect(updatedMatchUpResult.createdAt instanceof Timestamp).toBe(true)
      expect(updatedMatchUpResult.loses).toBe(2)
      expect(updatedMatchUpResult.matches).toBe(6)
      expect(updatedMatchUpResult.myFighterId).toBe('01')
      expect(updatedMatchUpResult.myFighterName).toBe('マリオ')
      expect(updatedMatchUpResult.opponentFighterId).toBe('02')
      expect(updatedMatchUpResult.opponentFighterName).toBe('ドンキーコング')
      expect(updatedMatchUpResult.updatedAt instanceof Timestamp).toBe(true)
      expect(updatedMatchUpResult.wins).toBe(4)
    })
  })

  describe('マッチアップ結果を作成するとき', async () => {
    test('勝ったとき', async () => {
      // ユーザーデータを作成
      await db.collection(userCollection).doc(userId).set(userData)

      // 今回作成された戦績データ（勝ち）
      const publicMatchData = {
        ...basePublicMatchData,
        result: 'WIN' as Result,
      }
      // マッチアップ結果を作成
      await saveMatchUpResult({ ...publicMatchData, publicMatchId })

      // マッチアップ結果を検証
      const snap = await db
        .collection(userCollection)
        .doc(userId)
        .collection(matchUpResultCollection)
        .get()
      expect(snap.size).toBe(1)
      const createdMatchUpResult = snap.docs[0].data() as MatchUpResult

      expect(createdMatchUpResult.createdAt instanceof Timestamp).toBe(true)
      expect(createdMatchUpResult.loses).toBe(0)
      expect(createdMatchUpResult.matches).toBe(1)
      expect(createdMatchUpResult.myFighterId).toBe('01')
      expect(createdMatchUpResult.myFighterName).toBe('マリオ')
      expect(createdMatchUpResult.opponentFighterId).toBe('02')
      expect(createdMatchUpResult.opponentFighterName).toBe('ドンキーコング')
      expect(createdMatchUpResult.updatedAt instanceof Timestamp).toBe(true)
      expect(createdMatchUpResult.wins).toBe(1)
    })

    test('負けたとき', async () => {
      // ユーザーデータを作成
      await db.collection(userCollection).doc(userId).set(userData)
      // 今回作成された戦績データ（負け）
      const publicMatchData = {
        ...basePublicMatchData,
        result: 'LOSE' as Result,
      }
      // マッチアップ結果を作成
      await saveMatchUpResult({ ...publicMatchData, publicMatchId })

      // マッチアップ結果を検証
      const snap = await db
        .collection(userCollection)
        .doc(userId)
        .collection(matchUpResultCollection)
        .get()
      expect(snap.size).toBe(1)
      const createdMatchUpResult = snap.docs[0].data() as MatchUpResult

      expect(createdMatchUpResult.createdAt instanceof Timestamp).toBe(true)
      expect(createdMatchUpResult.loses).toBe(1)
      expect(createdMatchUpResult.matches).toBe(1)
      expect(createdMatchUpResult.myFighterId).toBe('01')
      expect(createdMatchUpResult.myFighterName).toBe('マリオ')
      expect(createdMatchUpResult.opponentFighterId).toBe('02')
      expect(createdMatchUpResult.opponentFighterName).toBe('ドンキーコング')
      expect(createdMatchUpResult.updatedAt instanceof Timestamp).toBe(true)
      expect(createdMatchUpResult.wins).toBe(0)
    })
  })
})
