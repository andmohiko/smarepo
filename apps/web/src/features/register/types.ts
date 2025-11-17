import { z } from 'zod'

export const registerSchema = z.object({
  displayName: z.string().min(1).max(30),
  // アルファベットと数字とアンダースコアのみ
  username: z
    .string()
    .regex(/^[a-zA-Z0-9_]+$/)
    .min(5)
    .max(15),
  xId: z.string().min(1).max(15),
  profileImageUrl: z.string().min(1),
  mainFighter: z.string().min(1),
})

export type RegisterInputType = z.infer<typeof registerSchema>
