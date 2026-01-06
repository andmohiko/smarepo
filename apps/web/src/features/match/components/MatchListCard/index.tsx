import type { PublicMatch } from '@smarepo/common'
import { FaEdit } from 'react-icons/fa'

import styles from './style.module.css'

import { FighterIcon } from '~/components/Displays/FighterIcon'
import { ResultText } from '~/components/Typography/ResultText'
import { IconButton } from '~/components/Buttons/IconButton'

type Props = {
  match: PublicMatch
  onEdit?: () => void
}

export const MatchListCard = ({ match, onEdit }: Props): React.ReactNode => {
  return (
    <div className={styles.matchListCard}>
      <div className={styles.matchListCardContent}>
        <div className={styles.result}>
          <ResultText result={match.result} size="lg" />
        </div>
        <FighterIcon fighterId={match.myFighterId} size="md" />
        <FighterIcon fighterId={match.opponentFighterId} size="md" />
        <div className={styles.action}>
          <IconButton
            icon={<FaEdit size={20} />}
            importance="tertiary"
            onClick={onEdit}
          />
        </div>
      </div>
    </div>
  )
}
