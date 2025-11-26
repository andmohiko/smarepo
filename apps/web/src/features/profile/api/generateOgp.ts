/**
 * @file generateOgp.ts
 * @description OGP画像のCanvas生成関数
 * @remarks
 * プロフィール情報からOGP画像のCanvasを生成する
 */
import path from 'node:path'
import { createCanvas, GlobalFonts, loadImage } from '@napi-rs/canvas'
import { fighters } from '@smarepo/common'
import type { GenerateOgpRequest } from '~/pages/api/ogp/generate'

// OGP画像のサイズ (Twitter/OGP標準)
const OGP_WIDTH = 1200
const OGP_HEIGHT = 630
const primaryColor = '#69a5ff'
const textColor = '#333333'
const textLightColor = '#777777'

// Noto Sans JPフォントの登録
// public/fontsディレクトリに配置したTTFファイルを読み込む
try {
  // public/fontsディレクトリのパス
  const fontsDirPath = path.join(
    process.cwd(),
    'public',
    'fonts',
    'noto-sans-jp',
  )

  // 通常のフォント（weight 400）
  const regularFontPath = path.join(
    fontsDirPath,
    'static',
    'NotoSansJP-Regular.ttf',
  )

  // 太字フォント（weight 700）
  const boldFontPath = path.join(fontsDirPath, 'NotoSansJP-Bold.ttf')

  // TTFファイルを登録
  GlobalFonts.registerFromPath(regularFontPath, 'Noto Sans JP')
  GlobalFonts.registerFromPath(boldFontPath, 'Noto Sans JP Bold')
} catch (error) {
  // フォント登録に失敗した場合、デフォルトフォントを使用
  console.error(
    'フォントの登録に失敗しました。エラー詳細:',
    error instanceof Error ? error.message : String(error),
  )
}

/**
 * OGP画像のCanvasを生成する
 * @param profile - プロフィール情報
 * @returns CanvasのBuffer
 */
export const createOgpCanvas = async (
  profile: GenerateOgpRequest,
): Promise<Buffer> => {
  // Canvasを作成
  const canvas = createCanvas(OGP_WIDTH, OGP_HEIGHT)
  const ctx = canvas.getContext('2d')

  // 背景をprimary colorに設定
  ctx.fillStyle = primaryColor
  ctx.fillRect(0, 0, OGP_WIDTH, OGP_HEIGHT)

  // 中央に角丸の白い四角を描画（上下左右24pxずつ小さく）
  const padding = 20
  const borderRadius = 32
  const whiteRectX = padding
  const whiteRectY = padding
  const whiteRectWidth = OGP_WIDTH - padding * 2
  const whiteRectHeight = OGP_HEIGHT - padding * 2

  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  // 左上
  ctx.moveTo(whiteRectX + borderRadius, whiteRectY)
  ctx.arcTo(
    whiteRectX,
    whiteRectY,
    whiteRectX,
    whiteRectY + borderRadius,
    borderRadius,
  )
  // 左下
  ctx.lineTo(whiteRectX, whiteRectY + whiteRectHeight - borderRadius)
  ctx.arcTo(
    whiteRectX,
    whiteRectY + whiteRectHeight,
    whiteRectX + borderRadius,
    whiteRectY + whiteRectHeight,
    borderRadius,
  )
  // 右下
  ctx.lineTo(
    whiteRectX + whiteRectWidth - borderRadius,
    whiteRectY + whiteRectHeight,
  )
  ctx.arcTo(
    whiteRectX + whiteRectWidth,
    whiteRectY + whiteRectHeight,
    whiteRectX + whiteRectWidth,
    whiteRectY + whiteRectHeight - borderRadius,
    borderRadius,
  )
  // 右上
  ctx.lineTo(whiteRectX + whiteRectWidth, whiteRectY + borderRadius)
  ctx.arcTo(
    whiteRectX + whiteRectWidth,
    whiteRectY,
    whiteRectX + whiteRectWidth - borderRadius,
    whiteRectY,
    borderRadius,
  )
  ctx.closePath()
  ctx.fill()

  // プロフィール画像を描画（円形）
  try {
    if (profile.profileImageUrl) {
      const profileImage = await loadImage(profile.profileImageUrl)
      const imageSize = 320
      const imageX = 80
      const imageY = 100

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

      // 円の枠線（primary color）
      ctx.strokeStyle = primaryColor
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
  const textX = 470
  let textY = 140

  // 表示名
  ctx.fillStyle = textColor
  ctx.font = 'bold 56px "Noto Sans JP Bold", "Noto Sans JP", sans-serif'
  ctx.fillText(profile.displayName || 'Unknown User', textX, textY)

  // ユーザーID
  textY += 60
  ctx.fillStyle = textLightColor
  ctx.font = '32px "Noto Sans JP", sans-serif'
  ctx.fillText(`@${profile.username || 'unknown'}`, textX, textY)

  // メインファイター情報
  if (profile.mainFighter) {
    try {
      const fighterIconPath = `${process.env.NEXT_PUBLIC_APP_URL}/fighters/${fighters[profile.mainFighter].icon}`
      const fighterIcon = await loadImage(fighterIconPath)
      const iconSize = 60
      textY += 40
      ctx.drawImage(fighterIcon, textX, textY, iconSize, iconSize)
    } catch (_error) {
      // ファイターアイコンの読み込み失敗時はスキップ
    }
  }

  // 自己紹介
  if (profile.selfIntroduction) {
    textY += 120
    ctx.fillStyle = textLightColor
    ctx.font = '28px "Noto Sans JP", sans-serif'
    // テキストが長い場合は省略
    const maxWidth = 700
    const introductionText =
      profile.selfIntroduction.length > 50
        ? `${profile.selfIntroduction.substring(0, 50)}...`
        : profile.selfIntroduction
    ctx.fillText(introductionText, textX, textY, maxWidth)
  }

  // サイトロゴ/タイトル
  ctx.fillStyle = primaryColor
  ctx.font = 'bold 48px "Noto Sans JP Bold", "Noto Sans JP", sans-serif'
  ctx.fillText('スマレポ', 80, 570)

  ctx.fillStyle = primaryColor
  ctx.font = '24px "Noto Sans JP", sans-serif'
  ctx.fillText('スマブラ戦績記録・分析アプリ', 300, 570)

  // CanvasをBufferに変換
  return canvas.toBuffer('image/png')
}
