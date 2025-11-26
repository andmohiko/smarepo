/**
 * @file generate.ts
 * @description OGP画像生成API
 * @remarks
 * プロフィール情報からOGP画像を生成し、Firebase Storageにアップロードする
 * リクエストボディからプロフィール情報を受け取り、zodで検証する
 */
import { createCanvas, loadImage } from '@napi-rs/canvas'
import { fighters, profileCollection } from '@smarepo/common'
import type { NextApiRequest, NextApiResponse } from 'next'
import sharp from 'sharp'
import { v4 as uuid } from 'uuid'
import { z } from 'zod'
import { db, serverTimestamp, storage } from '~/lib/admin'

// OGP画像のサイズ (Twitter/OGP標準)
const OGP_WIDTH = 1200
const OGP_HEIGHT = 630

/**
 * OGP生成リクエストボディのzodスキーマ
 * @remarks
 * プロフィール情報とuserIdを含む
 */
const generateOgpRequestSchema = z.object({
  displayName: z.string(),
  mainFighter: z.string(),
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

    // Canvasを作成
    const canvas = createCanvas(OGP_WIDTH, OGP_HEIGHT)
    const ctx = canvas.getContext('2d')

    // 背景グラデーション
    const gradient = ctx.createLinearGradient(0, 0, OGP_WIDTH, OGP_HEIGHT)
    gradient.addColorStop(0, '#1a1a2e')
    gradient.addColorStop(1, '#16213e')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, OGP_WIDTH, OGP_HEIGHT)

    // アクセントライン
    ctx.strokeStyle = '#e94560'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(50, 100)
    ctx.lineTo(1150, 100)
    ctx.stroke()

    // プロフィール画像を描画（円形）
    try {
      if (profile.profileImageUrl) {
        const profileImage = await loadImage(profile.profileImageUrl)
        const imageSize = 200
        const imageX = 100
        const imageY = 200

        // 円形クリッピング
        ctx.save()
        ctx.beginPath()
        ctx.arc(
          imageX + imageSize / 2,
          imageY + imageSize / 2,
          imageSize / 2,
          0,
          Math.PI * 2,
        )
        ctx.closePath()
        ctx.clip()
        ctx.drawImage(profileImage, imageX, imageY, imageSize, imageSize)
        ctx.restore()

        // 円の枠線
        ctx.strokeStyle = '#e94560'
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.arc(
          imageX + imageSize / 2,
          imageY + imageSize / 2,
          imageSize / 2,
          0,
          Math.PI * 2,
        )
        ctx.stroke()
      }
    } catch (_error) {
      // プロフィール画像の読み込み失敗時はスキップ
    }

    // テキスト情報を描画
    const textX = 350
    let textY = 220

    // 表示名
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 60px sans-serif'
    ctx.fillText(profile.displayName || 'Unknown User', textX, textY)

    // ユーザーID
    textY += 70
    ctx.fillStyle = '#a0a0a0'
    ctx.font = '40px sans-serif'
    ctx.fillText(`@${profile.username || 'unknown'}`, textX, textY)

    // メインファイター情報
    if (profile.mainFighter) {
      textY += 80
      ctx.fillStyle = '#ffffff'
      ctx.font = '36px sans-serif'
      ctx.fillText('Main Fighter:', textX, textY)

      // ファイターアイコンを描画（可能であれば）
      try {
        const fighterIconPath = `${process.env.NEXT_PUBLIC_APP_URL}/fighters/${fighters[profile.mainFighter].icon}`
        const fighterIcon = await loadImage(fighterIconPath)
        const iconSize = 60
        ctx.drawImage(fighterIcon, textX + 250, textY - 50, iconSize, iconSize)
      } catch (_error) {
        // ファイターアイコンの読み込み失敗時はスキップ
      }
    }

    // 自己紹介
    if (profile.selfIntroduction) {
      textY += 80
      ctx.fillStyle = '#a0a0a0'
      ctx.font = '28px sans-serif'
      // テキストが長い場合は省略
      const maxWidth = 800
      const introductionText =
        profile.selfIntroduction.length > 50
          ? `${profile.selfIntroduction.substring(0, 50)}...`
          : profile.selfIntroduction
      ctx.fillText(introductionText, textX, textY, maxWidth)
    }

    // X ID
    if (profile.xId) {
      textY += 50
      ctx.fillStyle = '#ffffff'
      ctx.font = '32px sans-serif'
      ctx.fillText(`X: @${profile.xId}`, textX, textY)
    }

    // サイトロゴ/タイトル
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 48px sans-serif'
    ctx.fillText('スマレポ', 50, 580)

    ctx.fillStyle = '#a0a0a0'
    ctx.font = '32px sans-serif'
    ctx.fillText('スマブラ戦績記録・分析アプリ', 250, 580)

    // CanvasをBufferに変換
    const buffer = canvas.toBuffer('image/png')

    // Sharpで最適化
    const optimizedBuffer = await sharp(buffer)
      .png({ quality: 90, compressionLevel: 9 })
      .toBuffer()

    // Firebase Storageにアップロード
    const bucket = storage.bucket(
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    )
    const fileName = `images/users/${profile.userId}/ogp_${uuid()}.png`
    const file = bucket.file(fileName)

    await file.save(optimizedBuffer, {
      metadata: {
        contentType: 'image/png',
        cacheControl: 'public, max-age=3600',
      },
    })

    // 公開URLを取得
    await file.makePublic()
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`

    // FirestoreのプロフィールにOGP画像URLを保存
    await db.collection(profileCollection).doc(profile.userId).update({
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
