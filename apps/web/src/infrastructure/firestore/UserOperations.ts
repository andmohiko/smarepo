import { userCollection } from '@smarepo/common'
import type { CreateUserDto, Uid, UpdateUserDto, User } from '@smarepo/common'
import type { Unsubscribe } from 'firebase/firestore'
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore'

import { db } from '~/lib/firebase'
import { convertDate } from '~/utils/convertDate'

const dateColumns = ['createdAt', 'updatedAt'] as const satisfies Array<string>

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
      return
    },
  )
  return unsubscribe
}

export const createUserOperation = async (
  userId: Uid,
  dto: CreateUserDto,
): Promise<void> => {
  await setDoc(doc(db, userCollection, userId), dto)
}

export const updateUserOperation = async (
  userId: string,
  dto: UpdateUserDto,
): Promise<void> => {
  await updateDoc(doc(db, userCollection, userId), dto)
}

export const isExistsUserOperation = async (
  userId: string,
): Promise<boolean> => {
  const docSnap = await getDoc(doc(db, userCollection, userId))
  return docSnap.exists()
}
