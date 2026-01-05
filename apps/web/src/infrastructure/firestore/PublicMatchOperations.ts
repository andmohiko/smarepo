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
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where,
} from 'firebase/firestore'

import { db } from '~/lib/firebase'
import { convertDate } from '~/utils/convertDate'

/** 1ページあたりの取得件数 */
export const PUBLIC_MATCHES_PAGE_SIZE = 50

const dateColumns = ['createdAt', 'updatedAt'] as const satisfies Array<string>

/**
 * ドキュメントスナップショットからPublicMatchに変換するユーティリティ
 * @param docSnapshot - Firestoreドキュメントスナップショット
 * @returns PublicMatch型に変換されたデータ
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
 * 公開戦績をリアルタイム購読する（最初のページ用、limit付き）
 * @param userId - ユーザーID
 * @param pageSize - 取得件数
 * @param setter - 戦績配列を受け取るセッター関数
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
  )
  return unsubscribe
}

/**
 * ページネーション取得結果の型定義
 */
export type FetchPublicMatchesResult = {
  /** 取得した戦績配列 */
  matches: Array<PublicMatch>
  /** 次ページ取得用のカーソル（最後のドキュメント）。nullの場合は最終ページ */
  lastDoc: DocumentSnapshot | null
  /** 追加データがあるかどうか */
  hasMore: boolean
}

/**
 * 公開戦績をページネーションで取得する（追加読み込み用）
 * @param userId - ユーザーID
 * @param pageSize - 取得件数
 * @param lastDocument - 前回取得した最後のドキュメント（カーソル）
 * @returns 戦績配列、最後のドキュメント、追加データ有無
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

export const createPublicMatchOperation = async (
  dto: CreatePublicMatchDto,
): Promise<void> => {
  await addDoc(collection(db, publicMatchCollection), dto)
}

export const updatePublicMatchOperation = async (
  publicMatchId: PublicMatchId,
  dto: UpdatePublicMatchDto,
): Promise<void> => {
  await updateDoc(doc(db, publicMatchCollection, publicMatchId), dto)
}

export const deletePublicMatchOperation = async (
  publicMatchId: PublicMatchId,
): Promise<void> => {
  await deleteDoc(doc(db, publicMatchCollection, publicMatchId))
}
