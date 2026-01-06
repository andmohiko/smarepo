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
import { saveMatchUpResult } from '~/services/updateMatchUpResultService'

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
const previousPublicMatchId = 'previousPublicMatchId' as const
const previousPublicMatchBaseData: Omit<
  PublicMatch,
  'publicMatchId' | 'result'
> = {
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
const newPublicMatchId = 'newPublicMatchId' as const
const newPublicMatchBaseData: Omit<PublicMatch, 'publicMatchId' | 'result'> = {
  createdAt: new Date(),
  isContinuedMatch: false,
  isElite: false,
  globalSmashPower: null,
  myFighterId: '03',
  myFighterName: 'リンク',
  opponentFighterId: '04',
  opponentFighterName: 'サムス',
  stage: 'BATTLEFIELD',
  updatedAt: new Date(),
  userId: userId,
}
const previousMatchUpResultId = 'previousMatchUpResultId' as const
const previousMatchUpResultData: Omit<MatchUpResult, 'matchUpResultId'> = {
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
const newMatchUpResultId = 'newMatchUpResultId' as const
const newMatchUpResultData: Omit<MatchUpResult, 'matchUpResultId'> = {
  createdAt: new Date(),
  loses: 2,
  matches: 6,
  myFighterId: '03',
  myFighterName: 'リンク',
  opponentFighterId: '04',
  opponentFighterName: 'サムス',
  updatedAt: new Date(),
  wins: 4,
}

describe('updateMatchUpResult', () => {
  describe('マッチアップ結果を更新するとき', async () => {
    test('勝ったとき', async () => {
      // ユーザーデータを作成
      await db.collection(userCollection).doc(userId).set(userData)
      // 既存マッチアップデータを作成
      await db
        .collection(userCollection)
        .doc(userId)
        .collection(matchUpResultCollection)
        .doc(previousMatchUpResultId)
        .set(previousMatchUpResultData)
      await db
        .collection(userCollection)
        .doc(userId)
        .collection(matchUpResultCollection)
        .doc(newMatchUpResultId)
        .set(newMatchUpResultData)

      // 今回作成された戦績データを作成
      const previousPublicMatchData = {
        ...previousPublicMatchBaseData,
        result: 'WIN' as Result,
      }
      const newPublicMatchData = {
        ...newPublicMatchBaseData,
        result: 'WIN' as Result,
      }
      // マッチアップ結果を更新
      await saveMatchUpResult(
        { ...previousPublicMatchData, publicMatchId: previousPublicMatchId },
        { ...newPublicMatchData, publicMatchId: newPublicMatchId },
      )

      // マッチアップ結果を検証
      const snapPrevious = await db
        .collection(userCollection)
        .doc(userId)
        .collection(matchUpResultCollection)
        .doc(previousMatchUpResultId)
        .get()
      expect(snapPrevious.exists).toBe(true)
      const decrementedMatchUpResult = snapPrevious.data() as MatchUpResult

      expect(decrementedMatchUpResult.createdAt instanceof Timestamp).toBe(true)
      expect(decrementedMatchUpResult.loses).toBe(1)
      expect(decrementedMatchUpResult.matches).toBe(4)
      expect(decrementedMatchUpResult.myFighterId).toBe('01')
      expect(decrementedMatchUpResult.myFighterName).toBe('マリオ')
      expect(decrementedMatchUpResult.opponentFighterId).toBe('02')
      expect(decrementedMatchUpResult.opponentFighterName).toBe(
        'ドンキーコング',
      )
      expect(decrementedMatchUpResult.updatedAt instanceof Timestamp).toBe(true)
      expect(decrementedMatchUpResult.wins).toBe(3)

      const snapNew = await db
        .collection(userCollection)
        .doc(userId)
        .collection(matchUpResultCollection)
        .doc(newMatchUpResultId)
        .get()
      expect(snapNew.exists).toBe(true)
      const incrementedMatchUpResult = snapNew.data() as MatchUpResult

      expect(incrementedMatchUpResult.createdAt instanceof Timestamp).toBe(true)
      expect(incrementedMatchUpResult.loses).toBe(2)
      expect(incrementedMatchUpResult.matches).toBe(7)
      expect(incrementedMatchUpResult.myFighterId).toBe('03')
      expect(incrementedMatchUpResult.myFighterName).toBe('リンク')
      expect(incrementedMatchUpResult.opponentFighterId).toBe('04')
      expect(incrementedMatchUpResult.opponentFighterName).toBe('サムス')
      expect(incrementedMatchUpResult.updatedAt instanceof Timestamp).toBe(true)
      expect(incrementedMatchUpResult.wins).toBe(5)
    })
    test('負けたとき', async () => {
      // ユーザーデータを作成
      await db.collection(userCollection).doc(userId).set(userData)
      // 既存マッチアップデータを作成
      await db
        .collection(userCollection)
        .doc(userId)
        .collection(matchUpResultCollection)
        .doc(previousMatchUpResultId)
        .set(previousMatchUpResultData)
      await db
        .collection(userCollection)
        .doc(userId)
        .collection(matchUpResultCollection)
        .doc(newMatchUpResultId)
        .set(newMatchUpResultData)

      // 今回作成された戦績データを作成
      const previousPublicMatchData = {
        ...previousPublicMatchBaseData,
        result: 'LOSE' as Result,
      }
      const newPublicMatchData = {
        ...newPublicMatchBaseData,
        result: 'LOSE' as Result,
      }
      // マッチアップ結果を更新
      await saveMatchUpResult(
        { ...previousPublicMatchData, publicMatchId: previousPublicMatchId },
        { ...newPublicMatchData, publicMatchId: newPublicMatchId },
      )

      // マッチアップ結果を検証
      const snapPrevious = await db
        .collection(userCollection)
        .doc(userId)
        .collection(matchUpResultCollection)
        .doc(previousMatchUpResultId)
        .get()
      expect(snapPrevious.exists).toBe(true)
      const decrementedMatchUpResult = snapPrevious.data() as MatchUpResult

      expect(decrementedMatchUpResult.createdAt instanceof Timestamp).toBe(true)
      expect(decrementedMatchUpResult.loses).toBe(0)
      expect(decrementedMatchUpResult.matches).toBe(4)
      expect(decrementedMatchUpResult.myFighterId).toBe('01')
      expect(decrementedMatchUpResult.myFighterName).toBe('マリオ')
      expect(decrementedMatchUpResult.opponentFighterId).toBe('02')
      expect(decrementedMatchUpResult.opponentFighterName).toBe(
        'ドンキーコング',
      )
      expect(decrementedMatchUpResult.updatedAt instanceof Timestamp).toBe(true)
      expect(decrementedMatchUpResult.wins).toBe(4)

      const snapNew = await db
        .collection(userCollection)
        .doc(userId)
        .collection(matchUpResultCollection)
        .doc(newMatchUpResultId)
        .get()
      expect(snapNew.exists).toBe(true)
      const incrementedMatchUpResult = snapNew.data() as MatchUpResult

      expect(incrementedMatchUpResult.createdAt instanceof Timestamp).toBe(true)
      expect(incrementedMatchUpResult.loses).toBe(3)
      expect(incrementedMatchUpResult.matches).toBe(7)
      expect(incrementedMatchUpResult.myFighterId).toBe('03')
      expect(incrementedMatchUpResult.myFighterName).toBe('リンク')
      expect(incrementedMatchUpResult.opponentFighterId).toBe('04')
      expect(incrementedMatchUpResult.opponentFighterName).toBe('サムス')
      expect(incrementedMatchUpResult.updatedAt instanceof Timestamp).toBe(true)
      expect(incrementedMatchUpResult.wins).toBe(4)
    })
  })

  describe('マッチアップ結果を作成し直すとき', async () => {
    test('勝ったとき', async () => {
      // ユーザーデータを作成
      await db.collection(userCollection).doc(userId).set(userData)
      // 既存マッチアップデータを作成（更新前のマッチアップ結果のみ）
      await db
        .collection(userCollection)
        .doc(userId)
        .collection(matchUpResultCollection)
        .doc(previousMatchUpResultId)
        .set(previousMatchUpResultData)

      // 今回作成された戦績データを作成
      const previousPublicMatchData = {
        ...previousPublicMatchBaseData,
        result: 'WIN' as Result,
      }
      const newPublicMatchData = {
        ...newPublicMatchBaseData,
        result: 'WIN' as Result,
      }
      // マッチアップ結果を更新
      await saveMatchUpResult(
        { ...previousPublicMatchData, publicMatchId: previousPublicMatchId },
        { ...newPublicMatchData, publicMatchId: newPublicMatchId },
      )

      // 更新前のマッチアップ結果を検証（デクリメントされている）
      const snapPrevious = await db
        .collection(userCollection)
        .doc(userId)
        .collection(matchUpResultCollection)
        .doc(previousMatchUpResultId)
        .get()
      expect(snapPrevious.exists).toBe(true)
      const decrementedMatchUpResult = snapPrevious.data() as MatchUpResult

      expect(decrementedMatchUpResult.createdAt instanceof Timestamp).toBe(true)
      expect(decrementedMatchUpResult.loses).toBe(1)
      expect(decrementedMatchUpResult.matches).toBe(4)
      expect(decrementedMatchUpResult.myFighterId).toBe('01')
      expect(decrementedMatchUpResult.myFighterName).toBe('マリオ')
      expect(decrementedMatchUpResult.opponentFighterId).toBe('02')
      expect(decrementedMatchUpResult.opponentFighterName).toBe(
        'ドンキーコング',
      )
      expect(decrementedMatchUpResult.updatedAt instanceof Timestamp).toBe(true)
      expect(decrementedMatchUpResult.wins).toBe(3)

      // 更新後のマッチアップ結果を検証（新規作成されている）
      const snapNew = await db
        .collection(userCollection)
        .doc(userId)
        .collection(matchUpResultCollection)
        .get()
      expect(snapNew.size).toBe(2)
      const newMatchUpResultDocs = snapNew.docs.filter(
        (doc) => doc.id !== previousMatchUpResultId,
      )
      expect(newMatchUpResultDocs.length).toBe(1)
      const createdMatchUpResult =
        newMatchUpResultDocs[0].data() as MatchUpResult

      expect(createdMatchUpResult.createdAt instanceof Timestamp).toBe(true)
      expect(createdMatchUpResult.loses).toBe(0)
      expect(createdMatchUpResult.matches).toBe(1)
      expect(createdMatchUpResult.myFighterId).toBe('03')
      expect(createdMatchUpResult.myFighterName).toBe('リンク')
      expect(createdMatchUpResult.opponentFighterId).toBe('04')
      expect(createdMatchUpResult.opponentFighterName).toBe('サムス')
      expect(createdMatchUpResult.updatedAt instanceof Timestamp).toBe(true)
      expect(createdMatchUpResult.wins).toBe(1)
    })

    test('負けたとき', async () => {
      // ユーザーデータを作成
      await db.collection(userCollection).doc(userId).set(userData)
      // 既存マッチアップデータを作成（更新前のマッチアップ結果のみ）
      await db
        .collection(userCollection)
        .doc(userId)
        .collection(matchUpResultCollection)
        .doc(previousMatchUpResultId)
        .set(previousMatchUpResultData)

      // 今回作成された戦績データを作成
      const previousPublicMatchData = {
        ...previousPublicMatchBaseData,
        result: 'LOSE' as Result,
      }
      const newPublicMatchData = {
        ...newPublicMatchBaseData,
        result: 'LOSE' as Result,
      }
      // マッチアップ結果を更新
      await saveMatchUpResult(
        { ...previousPublicMatchData, publicMatchId: previousPublicMatchId },
        { ...newPublicMatchData, publicMatchId: newPublicMatchId },
      )

      // 更新前のマッチアップ結果を検証（デクリメントされている）
      const snapPrevious = await db
        .collection(userCollection)
        .doc(userId)
        .collection(matchUpResultCollection)
        .doc(previousMatchUpResultId)
        .get()
      expect(snapPrevious.exists).toBe(true)
      const decrementedMatchUpResult = snapPrevious.data() as MatchUpResult

      expect(decrementedMatchUpResult.createdAt instanceof Timestamp).toBe(true)
      expect(decrementedMatchUpResult.loses).toBe(0)
      expect(decrementedMatchUpResult.matches).toBe(4)
      expect(decrementedMatchUpResult.myFighterId).toBe('01')
      expect(decrementedMatchUpResult.myFighterName).toBe('マリオ')
      expect(decrementedMatchUpResult.opponentFighterId).toBe('02')
      expect(decrementedMatchUpResult.opponentFighterName).toBe(
        'ドンキーコング',
      )
      expect(decrementedMatchUpResult.updatedAt instanceof Timestamp).toBe(true)
      expect(decrementedMatchUpResult.wins).toBe(4)

      // 更新後のマッチアップ結果を検証（新規作成されている）
      const snapNew = await db
        .collection(userCollection)
        .doc(userId)
        .collection(matchUpResultCollection)
        .get()
      expect(snapNew.size).toBe(2)
      const newMatchUpResultDocs = snapNew.docs.filter(
        (doc) => doc.id !== previousMatchUpResultId,
      )
      expect(newMatchUpResultDocs.length).toBe(1)
      const createdMatchUpResult =
        newMatchUpResultDocs[0].data() as MatchUpResult

      expect(createdMatchUpResult.createdAt instanceof Timestamp).toBe(true)
      expect(createdMatchUpResult.loses).toBe(1)
      expect(createdMatchUpResult.matches).toBe(1)
      expect(createdMatchUpResult.myFighterId).toBe('03')
      expect(createdMatchUpResult.myFighterName).toBe('リンク')
      expect(createdMatchUpResult.opponentFighterId).toBe('04')
      expect(createdMatchUpResult.opponentFighterName).toBe('サムス')
      expect(createdMatchUpResult.updatedAt instanceof Timestamp).toBe(true)
      expect(createdMatchUpResult.wins).toBe(0)
    })
  })
})
