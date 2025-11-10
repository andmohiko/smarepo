import type { PublicMatch } from '@smarepo/common'

import styles from './style.module.scss'

import { BorderLine } from '~/components/Base/BorderLine'
import { ResultText } from '~/components/Typography/ResultText'

type Props = {
  matches: Array<PublicMatch>
}

export const MatchListSummary = ({ matches }: Props): React.ReactNode => {
  const wins = matches.filter((match) => match.result === 'WIN').length
  const loses = matches.filter((match) => match.result === 'LOSE').length
  return (
    <div className={styles.matchListSummary}>
      <div className={styles.resultWin}>
        <ResultText result="WIN" />
        <span className={styles.count}>{wins}</span>
      </div>
      <BorderLine orientation="vertical" />
      <div className={styles.resultLose}>
        <span className={styles.count}>{loses}</span>
        <ResultText result="LOSE" />
      </div>
    </div>
  )
}
