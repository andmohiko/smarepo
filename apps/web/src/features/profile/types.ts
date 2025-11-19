import { z } from 'zod'

export const editProfileSchema = z.object({
  displayName: z.string().min(1).max(30),
  // SW-1234-1234-1234のフォーマット
  friendCode: z
    .string()
    .min(17)
    .max(17)
    .regex(/^SW-\d{4}-\d{4}-\d{4}$/)
    .optional(),
  isPrivateProfile: z.boolean(),
  mainFighter: z.string().min(1),
  profileImageUrl: z.string().min(1),
  selfIntroduction: z.string().min(1).max(1000).optional(),
  // アルファベットと数字とアンダースコアのみ
  username: z
    .string()
    .regex(/^[a-zA-Z0-9_]+$/)
    .min(5)
    .max(15),
  voiceChat: z.object({
    discord: z.boolean(),
    line: z.boolean(),
    nintendoOnline: z.boolean(),
    listenOnly: z.boolean(),
  }),
  xId: z.string().min(1).max(15),
})

export type EditProfileInputType = z.infer<typeof editProfileSchema>
