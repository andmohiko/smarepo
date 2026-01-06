/**
 * @fileoverview 合計勝敗数サマリーコンポーネント
 * @description マッチアップ結果の合計勝ち数、負け数、勝率を表示する
 */

import type { FighterId, MatchUpResult } from '@smarepo/common'
import { FighterIcon } from '~/components/Displays/FighterIcon'
import { WinLoseResult } from '~/components/Displays/WinLoseResult'
import { LabelText } from '~/components/Typography/LabelText'
import styles from './style.module.css'

/**
 * TotalResultSummaryコンポーネントのProps型定義
 */
type Props = {
  myFighterId: FighterId | undefined
  matchUpResults: Array<MatchUpResult>
}

/**
 * 合計勝敗数サマリーコンポーネント
 * @param {Props} props - コンポーネントのプロパティ
 * @param {Array<MatchUpResult>} props.matchUpResults - マッチアップ結果
 * @returns {React.ReactNode} 合計勝敗数サマリーUI
 */
export const TotalResultSummary = ({
  myFighterId,
  matchUpResults,
}: Props): React.ReactNode => {
  const totalMatches = matchUpResults.reduce(
    (sum, result) => sum + result.matches,
    0,
  )
  const totalWins = matchUpResults.reduce((sum, result) => sum + result.wins, 0)
  const totalLoses = matchUpResults.reduce(
    (sum, result) => sum + result.loses,
    0,
  )

  return (
    <div className={styles.matchUpResultCard}>
      <div className={styles.matchUpResultCardContent}>
        {myFighterId ? (
          <FighterIcon fighterId={matchUpResults[0].myFighterId} size="md" />
        ) : (
          <div />
        )}
        <LabelText size="md" weight="bold">
          合計
        </LabelText>
        <div className={styles.result}>
          <WinLoseResult wins={totalWins} loses={totalLoses} />
        </div>
        <div className={styles.rate}>
          <LabelText size="md" weight="bold">
            {totalMatches > 0
              ? Math.round((totalWins / totalMatches) * 100)
              : 0}
            %
          </LabelText>
        </div>
      </div>
    </div>
  )
}
