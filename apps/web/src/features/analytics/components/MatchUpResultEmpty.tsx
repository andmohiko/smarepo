import { useRouter } from 'next/router'
import { RiSwordLine } from 'react-icons/ri'

import { BasicButton } from '~/components/Buttons/BasicButton'
import { EmptyState } from '~/components/Displays/EmptyState'

export const MatchUpResultEmpty = (): React.ReactNode => {
  const { push } = useRouter()
  return (
    <EmptyState
      icon={<RiSwordLine size={64} color="#228be6" />}
      title="俺たちの戦いはこれからだ！"
      description="戦績を追加するとここに表示されます"
      action={<BasicButton onClick={() => push('/')}>戦績を追加</BasicButton>}
    />
  )
}
