import type { PublicMatch } from '@smarepo/common'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { AddMatchButton } from '~/components/Buttons/AddMatchButton'
import { FighterIcon } from '~/components/Displays/FighterIcon'
import { LabelText } from '~/components/Typography/LabelText'
import styles from './style.module.css'

type Props = {
  matches: PublicMatch[]
  add: () => void
}

export const MatchListFooter = ({ matches, add }: Props): React.ReactNode => {
  const winningStreak = useMemo(() => {
    // 最新のファイターの連勝中を返す
    let streak = 0
    if (!matches.length) {
      return streak
    }
    const latestFighter = matches[0].myFighterId
    for (const match of matches) {
      if (match.myFighterId !== latestFighter) {
        break
      }
      if (match.result === 'WIN') {
        streak++
      } else {
        break
      }
    }
    return streak
  }, [matches])

  const todaysMatches = useMemo(() => {
    return matches.filter((match) =>
      dayjs(match.createdAt).isSame(new Date(), 'day'),
    )
  }, [matches])

  return (
    <div className={styles.matchListFooter}>
      {/* 連勝 */}
      <div className={styles.winningStreak}>
        {winningStreak > 0 && (
          <>
            <div className={styles.winningStreakFighterIcon}>
              <FighterIcon fighterId={matches[0].myFighterId} size="sm" />
            </div>
            <span className={styles.winningStreakCount}>{winningStreak}</span>
            <div className={styles.winningStreakLabel}>
              <LabelText size="sm" weight="bold">
                連勝中
              </LabelText>
            </div>
          </>
        )}
      </div>
      <div />
      {/* 追加ボタン */}
      <div className={styles.addMatchButton}>
        <AddMatchButton add={add} />
      </div>
      {/* ファイターアイコン */}
      <div className={styles.today}>
        {todaysMatches.length > 0 && (
          <>
            <LabelText size="sm" weight="bold">
              本日
            </LabelText>
            <span className={styles.countWin}>
              {todaysMatches.filter((match) => match.result === 'WIN').length}
            </span>
            <LabelText size="sm" weight="bold">
              勝
            </LabelText>
            <span className={styles.countLose}>
              {todaysMatches.filter((match) => match.result === 'LOSE').length}
            </span>
            <LabelText size="sm" weight="bold">
              敗
            </LabelText>
          </>
        )}
      </div>
    </div>
  )
}
