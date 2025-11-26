/**
 * @file sharp.ts
 * @description Sharpを使用した画像最適化ユーティリティ
 */
import sharp from 'sharp'

/**
 * BufferをSharpで最適化する
 * @param buffer - 最適化する画像のBuffer
 * @returns 最適化された画像のBuffer
 */
export const optimizeBufferBySharp = async (
  buffer: Buffer,
): Promise<Buffer> => {
  return await sharp(buffer)
    .png({ quality: 90, compressionLevel: 9 })
    .toBuffer()
}
