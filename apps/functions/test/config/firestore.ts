import { deleteApp, getApp, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

export const PROJECT_ID = 'smarepo-functions-test'

export const initializeFirebaseApp = () => {
  if (!getApps().length) {
    initializeApp({ projectId: PROJECT_ID })
  }
  return {
    app: getApp(),
    db: getFirestore(getApp()),
  }
}

export const deleteFirebaseApp = () => {
  deleteApp(getApp())
}

/**
 * Firestoreコレクションをクリアする関数
 * @param db - Firestoreインスタンス
 * @param collectionName - クリアするコレクション名
 * @param subCollectionName - サブコレクション名（オプション）
 */
export const clearCollection = async (
  db: FirebaseFirestore.Firestore,
  collectionName: string,
  subCollectionName?: string,
): Promise<void> => {
  if (subCollectionName) {
    const snap = await db.collection(collectionName).get()
    const batch = db.batch()

    // サブコレクションの削除処理を並列実行
    const subCollectionPromises = snap.docs.map(async (d) => {
      const subSnap = await db
        .collection(collectionName)
        .doc(d.id)
        .collection(subCollectionName)
        .get()
      subSnap.docs.forEach((subDoc) => {
        batch.delete(subDoc.ref)
      })
    })

    await Promise.all(subCollectionPromises)
    await batch.commit()
  } else {
    const snap = await db.collection(collectionName).get()
    const batch = db.batch()
    snap.docs.forEach((d) => {
      batch.delete(d.ref)
    })
    await batch.commit()
  }
}
