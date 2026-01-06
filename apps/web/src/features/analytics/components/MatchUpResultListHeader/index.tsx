import { LabelText } from '~/components/Typography/LabelText'
import styles from './style.module.css'

export const MatchUpResultListHeader = (): React.ReactNode => {
  return (
    <div className={styles.matchUpResultListHeader}>
      <div className={styles.matchUpResultListHeaderContent}>
        <div />
        <div />
        <div className={styles.result}>
          <LabelText size="sm">勝敗</LabelText>
        </div>
        <div className={styles.rate}>
          <LabelText size="sm">勝率</LabelText>
        </div>
      </div>
    </div>
  )
}
