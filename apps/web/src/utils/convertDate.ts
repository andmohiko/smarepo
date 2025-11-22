import type { DocumentData, Timestamp } from 'firebase/firestore'
import type * as admin from 'firebase-admin'
/**
 * firebaseのtimestamp型をDate型に変換する
 * @param snapshot
 * @param targetKey
 */
export function convertDate(
  snapshot: DocumentData,
  targetKey: Array<string>,
): DocumentData {
  targetKey.forEach((key) => {
    const value: Timestamp = snapshot[key]
    if (value) {
      snapshot[key] = value.toDate()
    }
  })
  return snapshot
}

/**
 * firebase-adminのtimestamp型をDate型に変換する
 * @param snapshot
 * @param targetKey
 */
export function convertDateForAdmin(
  snapshot: admin.firestore.DocumentData,
  targetKey: Array<string>,
): admin.firestore.DocumentData {
  targetKey.forEach((key) => {
    const value: Timestamp = snapshot[key]
    if (value) {
      snapshot[key] = value.toDate().toISOString()
    }
  })
  return snapshot
}
