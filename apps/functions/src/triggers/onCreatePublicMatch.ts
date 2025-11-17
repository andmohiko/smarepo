/**
 * 戦績作成時のトリガー関数
 * @description 戦績が作成された際に、勝率を更新する
 * @param {functions.firestore.QueryDocumentSnapshot} snap - 作成されたドキュメントのスナップショット
 * @param {functions.EventContext} context - イベントのコンテキスト情報
 * @throws {Error} 戦績が見つからない場合にエラーをスロー
 */
import { onDocumentCreated } from 'firebase-functions/v2/firestore'

import { convertPublicMatchForSnapOperation } from '~/infrastructure/firestore/PublicMatchOperations'
import { saveMatchUpResult } from '~/services/saveMatchUpResultService'
import { triggerOnce } from '~/utils/triggerOnce'

export const onCreatePublicMatch = onDocumentCreated(
  '/publicMatches/{publicMatchId}',
  triggerOnce('publicMatch', async (event) => {
    try {
      const publicMatchId = event.params.publicMatchId

      if (!event.data) {
        throw new Error(`作成されたデータが存在しません: ${publicMatchId}`)
      }

      const publicMatch = convertPublicMatchForSnapOperation(
        publicMatchId,
        event.data.data(),
      )

      if (!publicMatch) {
        throw new Error(`戦績データが存在しません: ${publicMatchId}`)
      }

      await saveMatchUpResult(publicMatch)
    } catch (error) {
      console.error('戦績作成時のエラー:', error)
      throw error
    }
  }),
)
