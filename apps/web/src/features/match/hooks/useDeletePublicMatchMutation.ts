import type { PublicMatchId } from '@smarepo/common'
import { deletePublicMatchOperation } from '~/infrastructure/firestore/PublicMatchOperations'
import { useFirebaseAuthContext } from '~/providers/FirebaseAuthProvider'

export const useDeletePublicMatchMutation = () => {
  const { uid } = useFirebaseAuthContext()

  const deletePublicMatch = async (publicMatchId: PublicMatchId) => {
    if (!uid) {
      throw new Error('ログインし直してください')
    }

    await deletePublicMatchOperation(publicMatchId)
  }

  return { deletePublicMatch }
}
