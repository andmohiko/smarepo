import { z } from 'zod'
import { auth } from '~/lib/firebase'

export const editProfileSchema = (currentUsername: string) =>
  z
    .object({
      displayName: z.string().min(1).max(30),
      // SW-1234-1234-1234のフォーマット
      friendCode: z
        .string()
        .optional()
        .refine(
          (val) => {
            // undefinedの場合はバリデーションをスキップ（optionalのため）
            if (!val) {
              return true
            }
            // 17文字で、SW-1234-1234-1234の形式であることを確認
            return val.length === 17 && /^SW-\d{4}-\d{4}-\d{4}$/.test(val)
          },
          {
            message:
              'フレンドコードはSW-1234-1234-1234の形式で入力してください',
          },
        ),
      isPrivateProfile: z.boolean(),
      mainFighterIds: z.array(z.string()).min(1),
      mainPlayingTime: z.string().min(1),
      profileImageUrl: z.string().min(1),
      selfIntroduction: z.string().min(1).max(1000).optional(),
      smashMateMaxRating: z.number().min(0).max(5000).optional(),
      // アルファベットと数字とアンダースコアのみ
      username: z
        .string()
        .regex(/^[a-zA-Z0-9_]+$/, {
          message:
            'ユーザー名は英数字とアンダースコア( _ )のみで入力してください',
        })
        .min(5, { message: 'ユーザー名は5文字以上で入力してください' })
        .max(15, { message: 'ユーザー名は15文字以内で入力してください' }),
      voiceChat: z.object({
        discord: z.boolean(),
        line: z.boolean(),
        nintendoOnline: z.boolean(),
        listenOnly: z.boolean(),
      }),
      xId: z.string().min(1).max(15),
    })
    .refine(
      async (data) => {
        if (data.username === currentUsername) {
          return true
        }
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

export type EditProfileInputType = z.infer<ReturnType<typeof editProfileSchema>>
