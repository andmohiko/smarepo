/**
 * @file generate.ts
 * @description OGP画像生成API
 * @remarks
 * プロフィール情報からOGP画像を生成し、Firebase Storageにアップロードする
 * リクエストボディからプロフィール情報を受け取り、zodで検証する
 */

import type { NextApiRequest, NextApiResponse } from 'next'
import { v4 as uuid } from 'uuid'
import { z } from 'zod'
import { createOgpCanvas } from '~/features/profile/api/generateOgp'
import { updateProfileOperation } from '~/infrastructure/firebaseAdmin/ProfileOperations'
import { uploadBufferAndGetPublicUrl } from '~/infrastructure/storageAdmin/UploadOperations'
import { serverTimestamp } from '~/lib/admin'
import { optimizeBufferBySharp } from '~/lib/sharp'

/**
 * OGP生成リクエストボディのzodスキーマ
 * @remarks
 * プロフィール情報とuserIdを含む
 */
const generateOgpRequestSchema = z.object({
  displayName: z.string(),
  mainFighterIds: z.array(z.string()),
  profileImageUrl: z.string().url(),
  selfIntroduction: z.string(),
  userId: z.string(),
  username: z.string(),
  xId: z.string(),
})

/**
 * OGP生成リクエストボディの型
 */
export type GenerateOgpRequest = z.infer<typeof generateOgpRequestSchema>

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // リクエストボディの検証
    const validationResult = generateOgpRequestSchema.safeParse(req.body)

    if (!validationResult.success) {
      return res.status(400).json({
        error: '/api/ogp/generate: Invalid request body',
        details: validationResult.error.errors,
      })
    }

    const profile: GenerateOgpRequest = validationResult.data

    // Canvasを作成してOGP画像を生成
    const buffer = await createOgpCanvas(profile)

    // Sharpで最適化
    const optimizedBuffer = await optimizeBufferBySharp(buffer)

    // Firebase Storageにアップロードして公開URLを取得
    const fileName = `images/users/${profile.userId}/ogp_${uuid()}.png`
    const publicUrl = await uploadBufferAndGetPublicUrl(
      optimizedBuffer,
      fileName,
    )

    // FirestoreのプロフィールにOGP画像URLを保存
    await updateProfileOperation(profile.userId, {
      ogpImageUrl: publicUrl,
      updatedAt: serverTimestamp,
    })

    return res.status(200).json({
      success: true,
      ogpImageUrl: publicUrl,
    })
  } catch (error) {
    console.error('OGP generation error:', error)
    return res.status(500).json({
      error: 'Failed to generate OGP image',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
