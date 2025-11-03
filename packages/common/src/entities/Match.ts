import { z } from 'zod'

export const resultEnum = z.enum(['WIN', 'LOSE', 'DRAW'])
export type Result = z.infer<typeof resultEnum>

export const resultLabel: Record<Result, string> = {
  WIN: '勝ち',
  LOSE: '負け',
  DRAW: '引き分け',
}
