/**
 * @file UploadOperations.ts
 * @description Firebase Storage Admin SDKを使用したアップロード操作
 * @remarks
 * サーバー側でFirebase Storageにファイルをアップロードし、公開URLを取得する
 */
import { storage } from '~/lib/admin'

/**
 * BufferをFirebase Storageにアップロードし、公開URLを取得する
 * @param buffer - アップロードするBuffer
 * @param fileName - ファイル名（パスを含む）
 * @param contentType - コンテンツタイプ（デフォルト: 'image/png'）
 * @param cacheControl - キャッシュコントロール（デフォルト: 'public, max-age=3600'）
 * @returns 公開URL
 */
export const uploadBufferAndGetPublicUrl = async (
  buffer: Buffer,
  fileName: string,
  contentType = 'image/png',
  cacheControl = 'public, max-age=3600',
): Promise<string> => {
  const bucket = storage.bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)
  const file = bucket.file(fileName)

  // ファイルをアップロード
  await file.save(buffer, {
    metadata: {
      contentType,
      cacheControl,
    },
  })

  // ファイルを公開にする
  await file.makePublic()

  // 公開URLを取得
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`

  return publicUrl
}
