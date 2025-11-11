import type { PublicMatch } from '@smarepo/common'
import { FaEdit } from 'react-icons/fa'

import styles from './style.module.css'

import { FighterIcon } from '~/components/Displays/FighterIcon'
import { ResultText } from '~/components/Typography/ResultText'
import { IconButton } from '~/components/Buttons/IconButton'

type Props = {
  match: PublicMatch
  onClick?: () => void
}

export const MatchListCard = ({ match, onClick }: Props): React.ReactNode => {
  return (
    <div className={styles.matchListCard}>
      <div className={styles.matchListCardContent}>
        <ResultText result={match.result} size="lg" />
        <FighterIcon fighterId={match.myFighterId} size="md" />
        <FighterIcon fighterId={match.opponentFighterId} size="md" />
        <IconButton
          icon={<FaEdit size={20} />}
          importance="tertiary"
          onClick={onClick}
        />
      </div>
    </div>
  )
}
