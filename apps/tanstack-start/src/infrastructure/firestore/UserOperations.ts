import type { CreateUserDto, User, UserId } from '@smarepo/common'
import { userCollection } from '@smarepo/common'
import type { Unsubscribe } from 'firebase/firestore'
import {
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore'

import { db } from '#/lib/firebase'
import { convertDate, dateColumns } from '#/utils/convertDate'

/**
 * ユーザーをIDで取得する
 * @param userId - ユーザーID
 * @returns ユーザー、存在しない場合はnull
 */
export const fetchUserByIdOperation = async (
  userId: UserId,
): Promise<User | null> => {
  const docSnap = await getDoc(doc(db, userCollection, userId))

  if (!docSnap.exists()) {
    return null
  }

  const data = docSnap.data()
  return {
    userId: docSnap.id,
    ...convertDate(data, dateColumns),
  } as User
}

/**
 * ユーザーをリアルタイム購読する
 * @param userId - ユーザーID
 * @param setter - ユーザーを設定する関数
 * @returns 購読解除関数
 */
export const subscribeUserOperation = (
  userId: string,
  setter: (user: User | null | undefined) => void,
): Unsubscribe => {
  const unsubscribe = onSnapshot(
    doc(db, userCollection, userId),
    (snapshot) => {
      const data = snapshot.data()
      if (!data) {
        setter(null)
        return
      }

      const user = {
        userId: snapshot.id,
        ...convertDate(data, dateColumns),
      } as User
      setter(user)
    },
    (error) => {
      console.error('ユーザー購読エラー:', error)
      setter(undefined) // エラー時はundefinedを設定
    },
  )

  return unsubscribe
}

/**
 * ユーザーを作成する
 * @param userId - ユーザーID（Firebase Auth UID）
 * @param dto - 作成データ
 */
export const createUserOperation = async (
  userId: UserId,
  dto: CreateUserDto,
): Promise<void> => {
  await setDoc(doc(db, userCollection, userId), dto)
}

/**
 * ユーザーが存在するかチェックする
 * @param userId - ユーザーID
 * @returns 存在する場合true
 */
export const isExistsUserOperation = async (
  userId: string,
): Promise<boolean> => {
  const docSnap = await getDoc(doc(db, userCollection, userId))
  return docSnap.exists()
}