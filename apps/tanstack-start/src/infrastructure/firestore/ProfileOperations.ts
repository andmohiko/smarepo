import type {
  CreateProfileDto,
  Profile,
  ProfileId,
  UpdateProfileDto,
} from '@smarepo/common'
import { profileCollection } from '@smarepo/common'
import type { Unsubscribe } from 'firebase/firestore'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'

import { db } from '#/lib/firebase'
import { convertDate, dateColumns } from '#/utils/convertDate'

/**
 * プロフィールをIDで取得する
 * @param profileId - プロフィールID
 * @returns プロフィール、存在しない場合はnull
 */
export const fetchProfileByIdOperation = async (
  profileId: ProfileId,
): Promise<Profile | null> => {
  const docSnap = await getDoc(doc(db, profileCollection, profileId))

  if (!docSnap.exists()) {
    return null
  }

  const data = docSnap.data()
  return {
    profileId: docSnap.id,
    ...convertDate(data, dateColumns),
  } as Profile
}

/**
 * プロフィールをユーザー名で取得する
 * @param username - ユーザー名
 * @returns プロフィール、存在しない場合はnull
 */
export const fetchProfileByUsernameOperation = async (
  username: Profile['username'],
): Promise<Profile | null> => {
  const snapshot = await getDocs(
    query(
      collection(db, profileCollection),
      where('username', '==', username),
      limit(1),
    ),
  )

  if (snapshot.size === 0) {
    return null
  }

  const data = snapshot.docs[0].data()
  return {
    profileId: snapshot.docs[0].id,
    ...convertDate(data, dateColumns),
  } as Profile
}

/**
 * プロフィールをリアルタイム購読する
 * @param profileId - プロフィールID
 * @param setter - プロフィールを設定する関数
 * @returns 購読解除関数
 */
export const subscribeProfileOperation = (
  profileId: string,
  setter: (profile: Profile | null | undefined) => void,
): Unsubscribe => {
  const unsubscribe = onSnapshot(
    doc(db, profileCollection, profileId),
    (snapshot) => {
      const data = snapshot.data()
      if (!data) {
        setter(null)
        return
      }

      const profile = {
        profileId: snapshot.id,
        ...convertDate(data, dateColumns),
      } as Profile
      setter(profile)
    },
    (error) => {
      console.error('プロフィール購読エラー:', error)
      setter(undefined) // エラー時はundefinedを設定
    },
  )

  return unsubscribe
}

/**
 * プロフィールを作成する
 * @param profileId - プロフィールID（通常はユーザーID）
 * @param dto - 作成データ
 */
export const createProfileOperation = async (
  profileId: ProfileId,
  dto: CreateProfileDto,
): Promise<void> => {
  await setDoc(doc(db, profileCollection, profileId), dto)
}

/**
 * プロフィールを更新する
 * @param profileId - プロフィールID
 * @param dto - 更新データ
 */
export const updateProfileOperation = async (
  profileId: ProfileId,
  dto: UpdateProfileDto,
): Promise<void> => {
  await updateDoc(doc(db, profileCollection, profileId), dto)
}

/**
 * プロフィールが存在するかチェックする
 * @param profileId - プロフィールID
 * @returns 存在する場合true
 */
export const isExistsProfileOperation = async (
  profileId: string,
): Promise<boolean> => {
  const docSnap = await getDoc(doc(db, profileCollection, profileId))
  return docSnap.exists()
}

/**
 * ユーザー名が利用可能かチェックする
 * @param username - チェックするユーザー名
 * @param currentUserId - 現在のユーザーID（自分のユーザー名は除外）
 * @returns 利用可能な場合true
 */
export const isUsernameAvailableOperation = async (
  username: string,
  currentUserId?: string,
): Promise<boolean> => {
  const snapshot = await getDocs(
    query(
      collection(db, profileCollection),
      where('username', '==', username),
      limit(1),
    ),
  )

  // データが存在しない場合は利用可能
  if (snapshot.size === 0) {
    return true
  }

  // 自分のプロフィールの場合は利用可能
  if (currentUserId && snapshot.docs[0].id === currentUserId) {
    return true
  }

  // 他のユーザーが使用している場合は利用不可
  return false
}