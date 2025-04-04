import { profileCollection } from '@smarepo/common'
import type {
  CreateProfileDto,
  Profile,
  Uid,
  UpdateProfileDto,
} from '@smarepo/common'
import type { Unsubscribe } from 'firebase/firestore'
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore'

import { db } from '~/lib/firebase'
import { convertDate } from '~/utils/convertDate'

const dateColumns = ['createdAt', 'updatedAt'] as const satisfies Array<string>

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
      return
    },
  )
  return unsubscribe
}

export const createUserOperation = async (
  userId: Uid,
  dto: CreateProfileDto,
): Promise<void> => {
  await setDoc(doc(db, profileCollection, userId), dto)
}

export const updateUserOperation = async (
  userId: string,
  dto: UpdateProfileDto,
): Promise<void> => {
  await updateDoc(doc(db, profileCollection, userId), dto)
}

export const isExistsProfileOperation = async (
  userId: string,
): Promise<boolean> => {
  const docSnap = await getDoc(doc(db, profileCollection, userId))
  return docSnap.exists()
}
