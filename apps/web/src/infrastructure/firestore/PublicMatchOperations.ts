import type {
  CreatePublicMatchDto,
  PublicMatch,
  PublicMatchId,
  UpdatePublicMatchDto,
} from '@smarepo/common'
import { publicMatchCollection } from '@smarepo/common'
import type { Unsubscribe } from 'firebase/firestore'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'

import { db } from '~/lib/firebase'
import { convertDate } from '~/utils/convertDate'

const dateColumns = ['createdAt', 'updatedAt'] as const satisfies Array<string>

export const subscribePublicMatchesOperation = (
  userId: string,
  setter: (matches: Array<PublicMatch>) => void,
): Unsubscribe => {
  const unsubscribe = onSnapshot(
    query(
      collection(db, publicMatchCollection),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
    ),
    (snapshot) => {
      const publicMatches = snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          publicMatchId: doc.id,
          ...convertDate(data, dateColumns),
        } as PublicMatch
      })
      setter(publicMatches)
    },
  )
  return unsubscribe
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
