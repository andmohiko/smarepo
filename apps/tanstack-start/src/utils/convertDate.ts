import type { DocumentData, Timestamp } from 'firebase/firestore'

/**
 * FirestoreのTimestamp型をDate型に変換するユーティリティ関数
 * @param snapshot - Firestoreから取得したドキュメントデータ
 * @param targetKeys - 変換対象のフィールド名の配列
 * @returns Date型に変換されたドキュメントデータ
 */
export function convertDate(
  snapshot: DocumentData,
  targetKeys: ReadonlyArray<string>,
): DocumentData {
  const result = { ...snapshot }

  targetKeys.forEach((key) => {
    const value = result[key]
    // Timestamp型かどうかチェック（toDateメソッドを持っているか）
    if (value && typeof value === 'object' && 'toDate' in value) {
      result[key] = (value as Timestamp).toDate()
    }
  })

  return result
}

/**
 * 日付フィールドを定義する定数
 * 各エンティティで共通的に使用される日付フィールド
 */
export const dateColumns = ['createdAt', 'updatedAt'] as const satisfies Array<string>