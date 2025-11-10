import { resultEnum } from '@smarepo/common'
import { z } from 'zod'

export const editPublicMatchSchema = z.object({
  isContinuedMatch: z.boolean(),
  isElite: z.boolean(),
  globalSmashPower: z.number().min(1).max(3000).optional(),
  myFighterId: z.string().optional(),
  opponentFighterId: z.string().optional(),
  result: resultEnum.optional(),
})

export type EditPublicMatchInputType = z.infer<typeof editPublicMatchSchema>
