import { privateMatchCollection } from '@smarepo/common'
import type {
  CreatePrivateMatchDto,
  PrivateMatch,
  PrivateMatchId,
  UpdatePrivateMatchDto,
} from '@smarepo/common'
import type { Unsubscribe } from 'firebase/firestore'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'

import { db } from '~/lib/firebase'
import { convertDate } from '~/utils/convertDate'

const dateColumns = ['createdAt', 'updatedAt'] as const satisfies Array<string>

export const subscribePrivateMatchesOperation = (
  userId: string,
  setter: (matches: Array<PrivateMatch> | null | undefined) => void,
): Unsubscribe => {
  const unsubscribe = onSnapshot(
    query(
      collection(db, privateMatchCollection),
      where('userId', '==', userId),
    ),
    (snapshot) => {
      const privateMatches = snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          privateMatchId: doc.id,
          ...convertDate(data, dateColumns),
        } as PrivateMatch
      })
      setter(privateMatches)
    },
  )
  return unsubscribe
}

export const createPrivateMatchOperation = async (
  dto: CreatePrivateMatchDto,
): Promise<void> => {
  await addDoc(collection(db, privateMatchCollection), dto)
}

export const updatePrivateMatchOperation = async (
  privateMatchId: PrivateMatchId,
  dto: UpdatePrivateMatchDto,
): Promise<void> => {
  await updateDoc(doc(db, privateMatchCollection, privateMatchId), dto)
}

export const deletePrivateMatchOperation = async (
  privateMatchId: PrivateMatchId,
): Promise<void> => {
  await deleteDoc(doc(db, privateMatchCollection, privateMatchId))
}
