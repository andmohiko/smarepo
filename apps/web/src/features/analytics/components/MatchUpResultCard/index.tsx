import type { MatchUpResult } from '@smarepo/common'

import { FighterIcon } from '~/components/Displays/FighterIcon'
import { WinLoseResult } from '~/components/Displays/WinLoseResult'
import { LabelText } from '~/components/Typography/LabelText'
import styles from './style.module.css'

type Props = {
  matchUpResult: MatchUpResult
}

export const MatchUpResultCard = ({
  matchUpResult,
}: Props): React.ReactNode => {
  const winRate = Math.round((matchUpResult.wins / matchUpResult.matches) * 100)
  return (
    <div className={styles.matchUpResultCard}>
      <div className={styles.matchUpResultCardContent}>
        <FighterIcon fighterId={matchUpResult.myFighterId} size="md" />
        <FighterIcon fighterId={matchUpResult.opponentFighterId} size="md" />
        <div className={styles.result}>
          <WinLoseResult
            wins={matchUpResult.wins}
            loses={matchUpResult.loses}
          />
        </div>
        <div className={styles.rate}>
          <LabelText size="md" weight="bold">
            {winRate}%
          </LabelText>
        </div>
      </div>
    </div>
  )
}
