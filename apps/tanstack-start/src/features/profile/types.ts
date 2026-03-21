import { z } from 'zod'

/**
 * プロフィール作成フォームの入力型
 */
export const createProfileSchema = z.object({
  displayName: z
    .string()
    .min(1, '表示名を入力してください')
    .max(30, '表示名は30文字以内で入力してください'),
  username: z
    .string()
    .min(5, 'ユーザー名は5文字以上で入力してください')
    .max(15, 'ユーザー名は15文字以内で入力してください')
    .regex(/^[a-zA-Z0-9_]+$/, 'ユーザー名は英数字とアンダースコアのみ使用できます'),
  xId: z
    .string()
    .min(1, 'X IDを入力してください')
    .max(15, 'X IDは15文字以内で入力してください'),
  profileImageUrl: z.string().min(1, 'プロフィール画像を設定してください'),
  mainFighterIds: z.array(z.string()).min(1, 'メインファイターを最低1つ選択してください'),
})

export type CreateProfileInputType = z.infer<typeof createProfileSchema>

/**
 * プロフィール更新フォームの入力型
 */
export const updateProfileSchema = z.object({
  displayName: z
    .string()
    .min(1, '表示名を入力してください')
    .max(30, '表示名は30文字以内で入力してください'),
  username: z
    .string()
    .min(5, 'ユーザー名は5文字以上で入力してください')
    .max(15, 'ユーザー名は15文字以内で入力してください')
    .regex(/^[a-zA-Z0-9_]+$/, 'ユーザー名は英数字とアンダースコアのみ使用できます'),
  xId: z
    .string()
    .min(1, 'X IDを入力してください')
    .max(15, 'X IDは15文字以内で入力してください'),
  friendCode: z
    .string()
    .regex(/^SW-\d{4}-\d{4}-\d{4}$/, 'フレンドコードの形式が正しくありません')
    .optional()
    .nullable(),
  profileImageUrl: z.string().min(1, 'プロフィール画像を設定してください'),
  mainFighterIds: z.array(z.string()).min(1, 'メインファイターを最低1つ選択してください'),
  mainPlayingTime: z.string().optional(),
  selfIntroduction: z.string().max(1000, '自己紹介は1000文字以内で入力してください').optional(),
  smashMateMaxRating: z.number().min(0).max(5000).nullable().optional(),
  voiceChat: z.object({
    discord: z.boolean(),
    line: z.boolean(),
    nintendoOnline: z.boolean(),
    listenOnly: z.boolean(),
  }),
  isPrivateProfile: z.boolean(),
})

export type UpdateProfileInputType = z.infer<typeof updateProfileSchema>

/**
 * ボイスチャット設定
 */
export interface VoiceChatSettings {
  discord: boolean
  line: boolean
  nintendoOnline: boolean
  listenOnly: boolean
}