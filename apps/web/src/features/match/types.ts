import { z } from 'zod'

export const editPublicMatchSchema = z.object({
  isContinuedMatch: z.boolean(),
  isElite: z.boolean(),
  globalSmashPower: z.number(),
  myFighterId: z.string(),
  opponentFighterId: z.string(),
  result: z.string(),
})

export type EditPublicMatchInputType = z.infer<typeof editPublicMatchSchema>
