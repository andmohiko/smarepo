import { profileCollection } from '@smarepo/common'
import { db } from '~/lib/firebase'

export const isExistsProfileByUsernameOperation = async (
  username: string,
): Promise<boolean> => {
  const snapshot = await db
    .collection(profileCollection)
    .where('username', '==', username)
    .limit(1)
    .get()
  return snapshot.size > 0
}
