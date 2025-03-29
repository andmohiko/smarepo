import { z } from 'zod'

export const resultEnum = z.enum(['win', 'lose', 'draw'])
export type Result = z.infer<typeof resultEnum>

export const resultLabel: Record<Result, string> = {
  win: '勝ち',
  lose: '負け',
  draw: '引き分け',
}
