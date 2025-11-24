/**
 * 戦績削除時のトリガー関数
 * @description 戦績が削除された際に、マッチアップ結果を更新する
 * @param {functions.firestore.QueryDocumentSnapshot} snap - 削除されたドキュメントのスナップショット
 * @param {functions.EventContext} context - イベントのコンテキスト情報
 * @throws {Error} 戦績が見つからない場合にエラーをスロー
 */
import { onDocumentDeleted } from 'firebase-functions/v2/firestore'
import '~/config/firebase'
import { convertPublicMatchForSnapOperation } from '~/infrastructure/firestore/PublicMatchOperations'
import { revertMatchUpResultForDelete } from '~/services/deleteMatchUpResultService'
import { triggerOnce } from '~/utils/triggerOnce'

export const onDeletePublicMatch = onDocumentDeleted(
  '/publicMatches/{publicMatchId}',
  triggerOnce('publicMatch', async (event) => {
    try {
      const publicMatchId = event.params.publicMatchId

      if (!event.data) {
        throw new Error(`削除されたデータが存在しません: ${publicMatchId}`)
      }

      const publicMatch = convertPublicMatchForSnapOperation(
        publicMatchId,
        event.data.data(),
      )

      if (!publicMatch) {
        throw new Error(`戦績データが存在しません: ${publicMatchId}`)
      }

      await revertMatchUpResultForDelete(publicMatch)
    } catch (error) {
      console.error('戦績削除時のエラー:', error)
      throw error
    }
  }),
)
