import { onlineStageEnum, resultEnum } from '@smarepo/common'
import { z } from 'zod'

export const editPublicMatchSchema = z.object({
  isContinuedMatch: z.boolean(),
  isElite: z.boolean(),
  globalSmashPower: z.number().min(1).max(3000).optional(),
  myFighterId: z.string(),
  opponentFighterId: z.string(),
  result: resultEnum,
  stage: onlineStageEnum.optional(),
})

export type EditPublicMatchInputType = z.infer<typeof editPublicMatchSchema>
