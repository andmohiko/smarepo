import type { FighterId, MatchUpResult } from '@smarepo/common'
import { fighters } from '@smarepo/common'

import { FighterIcon } from '~/components/Displays/FighterIcon'
import { WinLoseResult } from '~/components/Displays/WinLoseResult'
import { LabelText } from '~/components/Typography/LabelText'
import { useAnalyticsSettingsContext } from '~/providers/AnalyticsSettingsProvider'
import styles from './style.module.css'

type Props = {
  matchUpResult: MatchUpResult
}

/**
 * マッチアップ結果カードコンポーネント
 * @param {Props} props - コンポーネントのプロパティ
 * @returns {React.ReactNode} マッチアップ結果カードコンポーネント
 */
export const MatchUpResultCard = ({
  matchUpResult,
}: Props): React.ReactNode => {
  const { analyticsSettings } = useAnalyticsSettingsContext()
  const winRate = Math.round((matchUpResult.wins / matchUpResult.matches) * 100)

  // ダッシュファイターをグルーピングしている場合、相手ファイターのダッシュファイターも取得
  const opponentFighter = fighters[matchUpResult.opponentFighterId]
  const opponentDashFighterId: FighterId | null =
    analyticsSettings.isGroupDashFighters && opponentFighter?.hasDashFighter
      ? (opponentFighter.child as FighterId)
      : null

  return (
    <div className={styles.matchUpResultCard}>
      <div className={styles.matchUpResultCardContent}>
        <FighterIcon fighterId={matchUpResult.myFighterId} size="md" />
        <div className={styles.opponentFighters}>
          <FighterIcon fighterId={matchUpResult.opponentFighterId} size="md" />
          {opponentDashFighterId && (
            <FighterIcon fighterId={opponentDashFighterId} size="md" />
          )}
        </div>
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
