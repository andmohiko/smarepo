import type { PublicMatch } from '@smarepo/common'

import { BaseBottomSheet } from '~/components/Modals/BaseBottomSheet'
import { EditMatchForm } from '~/features/match/components/EditMatchForm'

type Props = {
  isOpen: boolean
  onClose: () => void
  match: PublicMatch | null
  isFirstMatch: boolean
}

export const EditMatchModal = ({
  isOpen,
  onClose,
  match,
  isFirstMatch,
}: Props): React.ReactElement => {
  return (
    <BaseBottomSheet
      title={match ? '戦績を編集' : '戦績を追加'}
      isOpen={isOpen}
      onClose={onClose}
    >
      <EditMatchForm
        onClose={onClose}
        defaultValues={match ?? undefined}
        isFirstMatch={isFirstMatch}
      />
    </BaseBottomSheet>
  )
}
