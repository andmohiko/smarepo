import type { FighterId, MatchUpResult } from '@smarepo/common'
import { fighters } from '@smarepo/common'
import { useMemo } from 'react'
import { useLocalStorage } from '~/hooks/useLocalStorage'
import { useAnalyticsSettingsContext } from '~/providers/AnalyticsSettingsProvider'

/** ローカルストレージのキー: 分析画面で選択したファイターID */
const STORAGE_KEY_ANALYTICS_MY_FIGHTER_ID = 'analytics_my_fighter_id'

/**
 * マッチアップ結果を集計するカスタムフック
 *
 * @description
 * マッチアップ結果を以下の処理で集計する:
 * 1. 自分のファイターIDでフィルタリング
 * 2. ダッシュファイターをグループ化（設定が有効な場合）
 *
 * @param {Array<MatchUpResult>} matchUpResults - マッチアップ結果の配列
 * @returns 集計されたマッチアップ結果と関連する状態
 */
export const useAggregateMatchUp = (matchUpResults: Array<MatchUpResult>) => {
  const { analyticsSettings } = useAnalyticsSettingsContext()
  const [myFighterId, setMyFighterId] = useLocalStorage<FighterId | undefined>(
    STORAGE_KEY_ANALYTICS_MY_FIGHTER_ID,
    undefined,
  )

  // 自分のファイターIDでフィルタリング
  const filteredMatchUpResults = useMemo(() => {
    return matchUpResults.filter((matchUpResult) => {
      if (myFighterId) {
        return matchUpResult.myFighterId === myFighterId
      }
      return true
    })
  }, [matchUpResults, myFighterId])

  // ダッシュファイターをグループ化
  const groupedMatchUpResults = useMemo(() => {
    if (!analyticsSettings.isGroupDashFighters) {
      return filteredMatchUpResults
    }

    // 親ファイターIDの組み合わせをキーとして、グループ化された結果を管理するMap
    const groupedMap = new Map<string, MatchUpResult>()

    for (const result of filteredMatchUpResults) {
      const opponentFighter = fighters[result.opponentFighterId]

      // 相手ファイターがダッシュファイターの場合のみ親ファイターIDを取得
      // 親子関係（マリオとドクターマリオなど）や兄弟関係はまとめない
      const isDashFighter = opponentFighter?.isDashFighter ?? false
      const parentOpponentFighterId =
        isDashFighter && opponentFighter?.parent
          ? opponentFighter.parent
          : result.opponentFighterId

      // 親ファイターの情報を取得
      const parentOpponentFighter = fighters[parentOpponentFighterId]

      // グループ化のキー（自分のファイターID + 相手の親ファイターID）
      const groupKey = `${result.myFighterId}_${parentOpponentFighterId}`

      const existingGroupedResult = groupedMap.get(groupKey)

      if (existingGroupedResult) {
        // 既存のグループ化された結果に統合
        groupedMap.set(groupKey, {
          ...existingGroupedResult,
          wins: existingGroupedResult.wins + result.wins,
          loses: existingGroupedResult.loses + result.loses,
          matches: existingGroupedResult.matches + result.matches,
        })
      } else {
        // 新しいグループ化された結果を作成
        // matchUpResultIdは一意性を保つため、ファイターIDの組み合わせを使用
        groupedMap.set(groupKey, {
          ...result,
          matchUpResultId:
            `${groupKey}_grouped` as MatchUpResult['matchUpResultId'],
          opponentFighterId: parentOpponentFighterId,
          opponentFighterName:
            parentOpponentFighter?.name ?? result.opponentFighterName,
        })
      }
    }

    return Array.from(groupedMap.values()).sort((a, b) => b.matches - a.matches)
  }, [filteredMatchUpResults, analyticsSettings.isGroupDashFighters])

  return {
    aggregatedMatchUpResults: groupedMatchUpResults,
    myFighterId,
    setMyFighterId,
  }
}
