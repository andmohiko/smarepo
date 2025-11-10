import { RiSwordLine } from 'react-icons/ri'
import { useDisclosure } from '@mantine/hooks'

import { BasicButton } from '~/components/Buttons/BasicButton'
import { EmptyState } from '~/components/Displays/EmptyState'
import { EditMatchModal } from '~/features/match/components/EditMatchModal'

export const MatchEmpty = (): React.ReactNode => {
  const [isOpen, handlers] = useDisclosure()

  return (
    <>
      <EmptyState
        icon={<RiSwordLine size={64} color="#228be6" />}
        title="俺たちの戦いはこれからだ！"
        description="戦績を追加するとここに表示されます"
        action={<BasicButton onClick={handlers.open}>戦績を追加</BasicButton>}
      />

      <EditMatchModal isOpen={isOpen} onClose={handlers.close} />
    </>
  )
}
