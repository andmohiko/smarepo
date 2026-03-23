import type { MatchUpResult } from '@smarepo/common'
import { matchUpResultCollection } from '@smarepo/common'
import type { Unsubscribe } from 'firebase/firestore'
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore'

import { db } from '#/lib/firebase'
import { convertDate, dateColumns } from '#/utils/convertDate'

/**
 * DocumentSnapshotをMatchUpResultに変換する
 * @param data - Firestoreのドキュメントデータ
 * @param id - ドキュメントID
 * @returns MatchUpResultオブジェクト
 */
const convertToMatchUpResult = (data: any, id: string): MatchUpResult => {
  return {
    matchUpResultId: id,
    ...convertDate(data, dateColumns),
  } as MatchUpResult
}

/**
 * ユーザーのマッチアップ結果を取得する
 * @param userId - ユーザーID
 * @returns マッチアップ結果リスト
 */
export const fetchMatchUpResultsOperation = async (
  userId: string,
): Promise<Array<MatchUpResult>> => {
  const snapshot = await getDocs(
    query(
      collection(db, 'users', userId, matchUpResultCollection),
      orderBy('matches', 'desc'), // 総対戦数の多い順
    ),
  )

  return snapshot.docs.map((doc) => convertToMatchUpResult(doc.data(), doc.id))
}

/**
 * ユーザーのマッチアップ結果をリアルタイム購読する
 * @param userId - ユーザーID
 * @param setter - マッチアップ結果リストを設定する関数
 * @returns 購読解除関数
 */
export const subscribeMatchUpResultsOperation = (
  userId: string,
  setter: (results: Array<MatchUpResult>) => void,
): Unsubscribe => {
  const unsubscribe = onSnapshot(
    query(
      collection(db, 'users', userId, matchUpResultCollection),
      orderBy('matches', 'desc'),
    ),
    (snapshot) => {
      const results = snapshot.docs.map((doc) =>
        convertToMatchUpResult(doc.data(), doc.id),
      )
      setter(results)
    },
    (error) => {
      console.error('マッチアップ結果購読エラー:', error)
      setter([]) // エラー時は空配列を設定
    },
  )

  return unsubscribe
}

/**
 * 特定のファイターでのマッチアップ結果を取得する
 * @param userId - ユーザーID
 * @param myFighterId - 自分のファイターID
 * @returns マッチアップ結果リスト
 */
export const fetchMatchUpResultsByFighterOperation = async (
  userId: string,
  myFighterId: string,
): Promise<Array<MatchUpResult>> => {
  const allResults = await fetchMatchUpResultsOperation(userId)

  // myFighterIdでフィルタリング
  return allResults.filter((result) => result.myFighterId === myFighterId)
}

/**
 * マッチアップ結果の統計情報を計算する
 * @param results - マッチアップ結果リスト
 * @returns 統計情報
 */
export interface MatchUpStatistics {
  totalMatches: number
  totalWins: number
  totalLoses: number
  winRate: number
  mostPlayedFighter: {
    fighterId: string
    fighterName: string
    matches: number
  } | null
  mostDifficultOpponent: {
    fighterId: string
    fighterName: string
    winRate: number
    matches: number
  } | null
}

export const calculateMatchUpStatistics = (
  results: Array<MatchUpResult>,
): MatchUpStatistics => {
  // 総計算
  let totalMatches = 0
  let totalWins = 0
  let totalLoses = 0

  // ファイター別集計用
  const fighterStats = new Map<string, {
    fighterId: string
    fighterName: string
    matches: number
    wins: number
    loses: number
  }>()

  // 相手ファイター別集計
  const opponentStats = new Map<string, {
    fighterId: string
    fighterName: string
    matches: number
    wins: number
    loses: number
  }>()

  results.forEach((result) => {
    totalMatches += result.matches
    totalWins += result.wins
    totalLoses += result.loses

    // 自分のファイター別集計
    const fighterKey = result.myFighterId
    const fighterStat = fighterStats.get(fighterKey) || {
      fighterId: result.myFighterId,
      fighterName: result.myFighterName,
      matches: 0,
      wins: 0,
      loses: 0,
    }
    fighterStat.matches += result.matches
    fighterStat.wins += result.wins
    fighterStat.loses += result.loses
    fighterStats.set(fighterKey, fighterStat)

    // 相手ファイター別集計
    const opponentKey = result.opponentFighterId
    const opponentStat = opponentStats.get(opponentKey) || {
      fighterId: result.opponentFighterId,
      fighterName: result.opponentFighterName,
      matches: 0,
      wins: 0,
      loses: 0,
    }
    opponentStat.matches += result.matches
    opponentStat.wins += result.wins
    opponentStat.loses += result.loses
    opponentStats.set(opponentKey, opponentStat)
  })

  // 勝率計算
  const winRate = totalMatches > 0 ? (totalWins / totalMatches) * 100 : 0

  // 最多使用ファイター
  let mostPlayedFighter = null
  let maxMatches = 0
  fighterStats.forEach((stat) => {
    if (stat.matches > maxMatches) {
      maxMatches = stat.matches
      mostPlayedFighter = {
        fighterId: stat.fighterId,
        fighterName: stat.fighterName,
        matches: stat.matches,
      }
    }
  })

  // 最も苦手な相手（最低5戦以上）
  let mostDifficultOpponent = null
  let lowestWinRate = 100
  opponentStats.forEach((stat) => {
    if (stat.matches >= 5) { // 最低5戦以上で判定
      const opponentWinRate = (stat.wins / stat.matches) * 100
      if (opponentWinRate < lowestWinRate) {
        lowestWinRate = opponentWinRate
        mostDifficultOpponent = {
          fighterId: stat.fighterId,
          fighterName: stat.fighterName,
          winRate: opponentWinRate,
          matches: stat.matches,
        }
      }
    }
  })

  return {
    totalMatches,
    totalWins,
    totalLoses,
    winRate,
    mostPlayedFighter,
    mostDifficultOpponent,
  }
}