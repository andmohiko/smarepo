import type { FighterId } from '@smarepo/common'
import { useState } from 'react'
import { FlexBox } from '~/components/Base/FlexBox'
import { LoadingAnimation } from '~/components/Base/Loading'
import { FighterSelectorInput } from '~/components/Inputs/FighterSelectorInput'
import { MatchUpResultCard } from '~/features/analytics/components/MatchUpResultCard'
import { MatchUpResultEmpty } from '~/features/analytics/components/MatchUpResultEmpty'
import { MatchUpResultListHeader } from '~/features/analytics/components/MatchUpResultListHeader'
import { useMyMatchUpResults } from '~/hooks/useMyMatchUpResults'
import { useToast } from '~/hooks/useToast'
import { unique } from '~/utils/array'
import styles from './style.module.css'

export const AnalyticsContainer = (): React.ReactNode => {
  const { showErrorToast } = useToast()
  const [matchUpResults, error, isLoading] = useMyMatchUpResults()
  const [myFighterId, setMyFighterId] = useState<FighterId | undefined>(
    undefined,
  )
  const recentFighters = unique<FighterId>(
    matchUpResults.map((matchUpResult) => matchUpResult.myFighterId),
  ).slice(0, 8)

  const filteredMatchUpResults = matchUpResults.filter((matchUpResult) => {
    if (myFighterId) {
      return matchUpResult.myFighterId === myFighterId
    }
    return true
  })

  if (error) {
    showErrorToast('マッチアップ戦績の取得に失敗しました')
  }

  return (
    <div className={styles.analyticsContainer}>
      {isLoading && <LoadingAnimation />}

      {/* マッチアップ結果がある場合 */}
      {matchUpResults.length > 0 && (
        <FlexBox align="center">
          <div className={styles.fighterSelectorInputContainer}>
            <FighterSelectorInput
              value={myFighterId ?? undefined}
              onChange={(value) => setMyFighterId(value)}
              isSelectFromRecentFighters
              isShowRecentFightersButton
              recentFighters={recentFighters}
              label="自分のファイター"
            />
          </div>
          <MatchUpResultListHeader />
          {filteredMatchUpResults.map((matchUpResult) => (
            <MatchUpResultCard
              key={matchUpResult.matchUpResultId}
              matchUpResult={matchUpResult}
            />
          ))}
        </FlexBox>
      )}

      {/* マッチアップ結果が空の場合 */}
      {!isLoading && matchUpResults.length === 0 && <MatchUpResultEmpty />}
    </div>
  )
}
