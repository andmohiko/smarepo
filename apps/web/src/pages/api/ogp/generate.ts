import { createCanvas, GlobalFonts, loadImage } from '@napi-rs/canvas'
import { profileCollection } from '@smarepo/common'
import type { NextApiRequest, NextApiResponse } from 'next'
import sharp from 'sharp'
import admin, { db } from '~/lib/admin'

// OGP画像のサイズ (Twitter/OGP標準)
const OGP_WIDTH = 1200
const OGP_HEIGHT = 630

// フォントの登録（システムフォントを使用）
try {
  GlobalFonts.registerFromPath(
    '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
    'DejaVuSans-Bold',
  )
  GlobalFonts.registerFromPath(
    '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
    'DejaVuSans',
  )
} catch (_error) {
  // フォント登録失敗時はデフォルトフォントを使用
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' })
    }

    // Firestoreからプロフィール情報を取得
    const profileDoc = await db.collection(profileCollection).doc(userId).get()

    if (!profileDoc.exists) {
      return res.status(404).json({ error: 'Profile not found' })
    }

    const profile = profileDoc.data()
    if (!profile) {
      return res.status(404).json({ error: 'Profile data is empty' })
    }

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
    ctx.font = 'bold 60px DejaVuSans-Bold, sans-serif'
    ctx.fillText(profile.displayName || 'Unknown User', textX, textY)

    // ユーザーID
    textY += 70
    ctx.fillStyle = '#a0a0a0'
    ctx.font = '40px DejaVuSans, sans-serif'
    ctx.fillText(`@${profile.username || 'unknown'}`, textX, textY)

    // メインファイター情報
    if (profile.mainFighter) {
      textY += 80
      ctx.fillStyle = '#ffffff'
      ctx.font = '36px DejaVuSans, sans-serif'
      ctx.fillText('Main Fighter:', textX, textY)

      // ファイターアイコンを描画（可能であれば）
      try {
        const fighterIconPath = `${process.env.NEXT_PUBLIC_APP_URL}/images/fighters/${profile.mainFighter}.png`
        const fighterIcon = await loadImage(fighterIconPath)
        const iconSize = 60
        ctx.drawImage(fighterIcon, textX + 250, textY - 50, iconSize, iconSize)
      } catch (_error) {
        // ファイターアイコンの読み込み失敗時はスキップ
      }
    }

    // スマメイトレート
    if (profile.smashMateMaxRating) {
      textY += 70
      ctx.fillStyle = '#e94560'
      ctx.font = 'bold 36px DejaVuSans-Bold, sans-serif'
      ctx.fillText(`SmashMate: ${profile.smashMateMaxRating}`, textX, textY)
    }

    // サイトロゴ/タイトル
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 48px DejaVuSans-Bold, sans-serif'
    ctx.fillText('スマレポ', 50, 580)

    ctx.fillStyle = '#a0a0a0'
    ctx.font = '32px DejaVuSans, sans-serif'
    ctx.fillText('スマブラ戦績記録・分析アプリ', 250, 580)

    // CanvasをBufferに変換
    const buffer = canvas.toBuffer('image/png')

    // Sharpで最適化
    const optimizedBuffer = await sharp(buffer)
      .png({ quality: 90, compressionLevel: 9 })
      .toBuffer()

    // Firebase Storageにアップロード
    const bucket = admin.storage().bucket()
    const fileName = `ogp/users/${userId}.png`
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
    await db.collection(profileCollection).doc(userId).update({
      ogpImageUrl: publicUrl,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
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
