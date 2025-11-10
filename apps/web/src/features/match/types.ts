import { resultEnum } from '@smarepo/common'
import { z } from 'zod'

export const editPublicMatchSchema = z.object({
  isContinuedMatch: z.boolean(),
  isElite: z.boolean(),
  globalSmashPower: z.number(),
  myFighterId: z.string(),
  opponentFighterId: z.string(),
  result: resultEnum.optional(),
})

export type EditPublicMatchInputType = z.infer<typeof editPublicMatchSchema>
