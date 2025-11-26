import type {
  Profile,
  SerializedProfile,
  UpdateProfileFromAdminDto,
} from '@smarepo/common'
import { profileCollection } from '@smarepo/common'

import { db } from '~/lib/admin'
import { convertDateForAdmin } from '~/utils/convertDate'

const dateColumns = ['createdAt', 'updatedAt'] as const satisfies Array<string>

export const fetchProfileByUsernameOperation = async (
  username: Profile['username'],
): Promise<SerializedProfile | null> => {
  const snapshot = await db
    .collection(profileCollection)
    .where('username', '==', username)
    .limit(1)
    .get()
  if (snapshot.size === 0) {
    return null
  }
  const data = snapshot.docs[0].data()
  return {
    profileId: snapshot.docs[0].id,
    ...convertDateForAdmin(data, dateColumns),
  } as SerializedProfile
}

export const updateProfileOperation = async (
  profileId: string,
  dto: UpdateProfileFromAdminDto,
) => {
  await db.collection(profileCollection).doc(profileId).update(dto)
}
