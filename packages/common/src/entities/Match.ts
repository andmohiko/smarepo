import { z } from 'zod'

export const resultEnum = z.enum(['WIN', 'LOSE', 'DRAW'])
export type Result = z.infer<typeof resultEnum>

export const resultLabel: Record<Result, string> = {
  WIN: '勝ち',
  LOSE: '負け',
  DRAW: '引き分け',
}

export const onlineStageEnum = z.enum([
  'BATTLEFIELD',
  'SMALL_BATTLEFIELD',
  'FINAL_DESTINATION',
])
export type OnlineStage = z.infer<typeof onlineStageEnum>

export const onlineStageOptions: Record<OnlineStage, string> = {
  BATTLEFIELD: '戦場',
  SMALL_BATTLEFIELD: '小戦場',
  FINAL_DESTINATION: '終点',
}
