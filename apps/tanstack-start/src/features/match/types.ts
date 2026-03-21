import type { OnlineStage, Result } from '@smarepo/common'
import { z } from 'zod'

/**
 * 戦績編集フォームの入力型
 */
export const editPublicMatchSchema = z.object({
  myFighterId: z.string().min(1, '自分のファイターを選択してください'),
  opponentFighterId: z.string().min(1, '相手のファイターを選択してください'),
  result: z.enum(['WIN', 'LOSE', 'DRAW'] as const, {
    required_error: '勝敗を選択してください',
  }),
  stage: z.enum(['BATTLEFIELD', 'SMALL_BATTLEFIELD', 'FINAL_DESTINATION'] as const).nullable().optional(),
  globalSmashPower: z.number().min(1).max(3000).nullable().optional(),
  isElite: z.boolean().default(false),
  isContinuedMatch: z.boolean().default(false),
})

export type EditPublicMatchInputType = z.infer<typeof editPublicMatchSchema>

/**
 * 戦績表示用の型（万単位の世界戦闘力を含む）
 */
export interface PublicMatchDisplay {
  publicMatchId: string
  myFighterId: string
  myFighterName: string
  opponentFighterId: string
  opponentFighterName: string
  result: Result
  stage: OnlineStage | null
  globalSmashPowerInMan: number | null // 万単位の世界戦闘力
  isElite: boolean
  isContinuedMatch: boolean
  createdAt: Date
}