import type { PublicMatch, PublicMatchId } from '@smarepo/common'
import type { DocumentData } from 'firebase-admin/firestore'

import { convertDate } from '~/utils/convertDate'

const dateColumns = ['createdAt']

export const convertPublicMatchForSnapOperation = (
  publicMatchId: PublicMatchId,
  data: DocumentData,
): PublicMatch | null => {
  return {
    publicMatchId,
    ...convertDate(data, dateColumns),
  } as PublicMatch
}
