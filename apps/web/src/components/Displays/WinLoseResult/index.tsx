import { LabelText } from '~/components/Typography/LabelText'
import styles from './style.module.css'

type Props = {
  wins: number
  loses: number
}
export const WinLoseResult = ({ wins, loses }: Props): React.ReactNode => {
  return (
    <div className={styles.winLoseResult}>
      <span className={styles.countWin}>{wins}</span>
      <LabelText size="sm" weight="bold">
        勝
      </LabelText>
      <span className={styles.countLose}>{loses}</span>
      <LabelText size="sm" weight="bold">
        敗
      </LabelText>
    </div>
  )
}
