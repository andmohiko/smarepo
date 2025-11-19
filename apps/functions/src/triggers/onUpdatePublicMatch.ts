/**
 * 戦績作成時のトリガー関数
 * @description 戦績が作成された際に、勝率を更新する
 * @param {functions.firestore.QueryDocumentSnapshot} snap - 作成されたドキュメントのスナップショット
 * @param {functions.EventContext} context - イベントのコンテキスト情報
 * @throws {Error} 戦績が見つからない場合にエラーをスロー
 */
import { onDocumentUpdated } from 'firebase-functions/v2/firestore'
import '~/config/firebase'
import { convertPublicMatchForSnapOperation } from '~/infrastructure/firestore/PublicMatchOperations'
import { saveMatchUpResult } from '~/services/updateMatchUpResultService'
import { triggerOnce } from '~/utils/triggerOnce'

export const onUpdatePublicMatch = onDocumentUpdated(
  '/publicMatches/{publicMatchId}',
  triggerOnce('publicMatch', async (event) => {
    try {
      const publicMatchId = event.params.publicMatchId

      if (!event.data) {
        throw new Error(`作成されたデータが存在しません: ${publicMatchId}`)
      }

      const previousPublicMatch = convertPublicMatchForSnapOperation(
        publicMatchId,
        event.data.before.data(),
      )
      const newPublicMatch = convertPublicMatchForSnapOperation(
        publicMatchId,
        event.data.after.data(),
      )

      if (!previousPublicMatch || !newPublicMatch) {
        throw new Error(`戦績データが存在しません: ${publicMatchId}`)
      }

      // 更新された戦績のファイターまたは勝敗が変わっていた場合、マッチアップ結果を更新
      if (
        previousPublicMatch.myFighterId !== newPublicMatch.myFighterId ||
        previousPublicMatch.opponentFighterId !==
          newPublicMatch.opponentFighterId ||
        previousPublicMatch.result !== newPublicMatch.result
      ) {
        await saveMatchUpResult(previousPublicMatch, newPublicMatch)
      }
    } catch (error) {
      console.error('戦績作成時のエラー:', error)
      throw error
    }
  }),
)
