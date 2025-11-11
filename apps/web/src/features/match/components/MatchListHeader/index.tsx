import styles from './style.module.css'

import { LabelText } from '~/components/Typography/LabelText'

export const MatchListHeader = (): React.ReactNode => {
  return (
    <div className={styles.matchListHeader}>
      <div className={styles.matchListHeaderContent}>
        <LabelText size="sm">勝敗</LabelText>
        <LabelText size="sm">自分</LabelText>
        <LabelText size="sm">相手</LabelText>
        <div />
      </div>
    </div>
  )
}
