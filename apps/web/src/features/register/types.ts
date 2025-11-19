import { z } from 'zod'
import { auth } from '~/lib/firebase'

export const registerSchema = z
  .object({
    displayName: z.string().min(1).max(30),
    // アルファベットと数字とアンダースコアのみ
    username: z
      .string()
      .regex(/^[a-zA-Z0-9_]+$/, {
        message:
          'ユーザー名は英数字とアンダースコア( _ )のみで入力してください',
      })
      .min(5, { message: 'ユーザー名は5文字以上で入力してください' })
      .max(15, { message: 'ユーザー名は15文字以内で入力してください' }),
    xId: z.string().min(1).max(15),
    profileImageUrl: z.string().min(1),
    mainFighter: z.string().min(1),
  })
  .refine(
    async (data) => {
      // 認証トークンを取得する
      const currentUser = auth.currentUser
      if (!currentUser) {
        return false
      }
      const token = await currentUser.getIdToken()

      // APIを呼び出してユーザー名が有効かどうかを取得する
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/user/username`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ username: data.username }),
        },
      )
      const { isValid } = await response.json()
      return isValid
    },
    {
      message: 'ユーザー名が使用できません',
      path: ['username'],
    },
  )

export type RegisterInputType = z.infer<typeof registerSchema>
