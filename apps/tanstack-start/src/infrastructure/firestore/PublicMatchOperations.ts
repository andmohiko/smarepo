import type {
  CreatePublicMatchDto,
  PublicMatch,
  PublicMatchId,
  UpdatePublicMatchDto,
} from '@smarepo/common'
import { publicMatchCollection } from '@smarepo/common'
import type { DocumentSnapshot, Unsubscribe } from 'firebase/firestore'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where,
} from 'firebase/firestore'

import { db } from '#/lib/firebase'
import { convertDate, dateColumns } from '#/utils/convertDate'

/**
 * 1ページあたりの取得件数
 */
export const PUBLIC_MATCHES_PAGE_SIZE = 50

/**
 * DocumentSnapshotをPublicMatchに変換する
 * @param docSnapshot - Firestoreのドキュメントスナップショット
 * @returns PublicMatchオブジェクト
 */
const convertToPublicMatch = (docSnapshot: DocumentSnapshot): PublicMatch => {
  const data = docSnapshot.data()
  if (!data) {
    throw new Error('データが存在しません')
  }
  return {
    publicMatchId: docSnapshot.id,
    ...convertDate(data, dateColumns),
  } as PublicMatch
}

/**
 * 公開戦績をIDで取得する
 * @param publicMatchId - 戦績ID
 * @returns 戦績、存在しない場合はnull
 */
export const fetchPublicMatchByIdOperation = async (
  publicMatchId: PublicMatchId,
): Promise<PublicMatch | null> => {
  const docSnap = await getDoc(doc(db, publicMatchCollection, publicMatchId))

  if (!docSnap.exists()) {
    return null
  }

  return convertToPublicMatch(docSnap)
}

/**
 * 公開戦績をリアルタイム購読する（最初のページ）
 * @param userId - ユーザーID
 * @param pageSize - ページサイズ
 * @param setter - 戦績リストを設定する関数
 * @returns 購読解除関数
 */
export const subscribePublicMatchesOperation = (
  userId: string,
  pageSize: number,
  setter: (matches: Array<PublicMatch>) => void,
): Unsubscribe => {
  const unsubscribe = onSnapshot(
    query(
      collection(db, publicMatchCollection),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(pageSize),
    ),
    (snapshot) => {
      const publicMatches = snapshot.docs.map(convertToPublicMatch)
      setter(publicMatches)
    },
    (error) => {
      console.error('戦績購読エラー:', error)
      setter([]) // エラー時は空配列を設定
    },
  )

  return unsubscribe
}

/**
 * ページネーション取得結果の型定義
 */
export type FetchPublicMatchesResult = {
  matches: Array<PublicMatch>
  lastDoc: DocumentSnapshot | null
  hasMore: boolean
}

/**
 * 公開戦績をページネーションで取得する
 * @param userId - ユーザーID
 * @param pageSize - ページサイズ
 * @param lastDocument - 前ページの最後のドキュメント（カーソル）
 * @returns 戦績リストとページネーション情報
 */
export const fetchPublicMatchesOperation = async (
  userId: string,
  pageSize: number,
  lastDocument: DocumentSnapshot | null,
): Promise<FetchPublicMatchesResult> => {
  // クエリ条件を構築
  const baseConstraints = [
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  ]

  // カーソルがある場合はstartAfterを追加
  const constraints = lastDocument
    ? [...baseConstraints, startAfter(lastDocument), limit(pageSize)]
    : [...baseConstraints, limit(pageSize)]

  const snapshot = await getDocs(
    query(collection(db, publicMatchCollection), ...constraints),
  )

  const matches = snapshot.docs.map(convertToPublicMatch)
  const lastDoc =
    snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null
  const hasMore = snapshot.docs.length === pageSize

  return { matches, lastDoc, hasMore }
}

/**
 * 公開戦績を作成する
 * @param dto - 作成データ
 * @returns 作成された戦績のID
 */
export const createPublicMatchOperation = async (
  dto: CreatePublicMatchDto,
): Promise<PublicMatchId> => {
  const docRef = await addDoc(collection(db, publicMatchCollection), dto)
  return docRef.id as PublicMatchId
}

/**
 * 公開戦績を更新する
 * @param publicMatchId - 戦績ID
 * @param dto - 更新データ
 */
export const updatePublicMatchOperation = async (
  publicMatchId: PublicMatchId,
  dto: UpdatePublicMatchDto,
): Promise<void> => {
  await updateDoc(doc(db, publicMatchCollection, publicMatchId), dto)
}

/**
 * 公開戦績を削除する
 * @param publicMatchId - 戦績ID
 */
export const deletePublicMatchOperation = async (
  publicMatchId: PublicMatchId,
): Promise<void> => {
  await deleteDoc(doc(db, publicMatchCollection, publicMatchId))
}

/**
 * ユーザーの総戦績数を取得する
 * @param userId - ユーザーID
 * @returns 総戦績数
 */
export const countPublicMatchesOperation = async (
  userId: string,
): Promise<number> => {
  const snapshot = await getDocs(
    query(collection(db, publicMatchCollection), where('userId', '==', userId)),
  )
  return snapshot.size
}

/**
 * 特定のファイターでの戦績を取得する
 * @param userId - ユーザーID
 * @param fighterId - ファイターID
 * @param pageSize - ページサイズ
 * @returns 戦績リスト
 */
export const fetchPublicMatchesByFighterOperation = async (
  userId: string,
  fighterId: string,
  pageSize = PUBLIC_MATCHES_PAGE_SIZE,
): Promise<Array<PublicMatch>> => {
  const snapshot = await getDocs(
    query(
      collection(db, publicMatchCollection),
      where('userId', '==', userId),
      where('myFighterId', '==', fighterId),
      orderBy('createdAt', 'desc'),
      limit(pageSize),
    ),
  )

  return snapshot.docs.map(convertToPublicMatch)
}