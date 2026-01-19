import { useDisclosure } from '@mantine/hooks'
import type { FighterId } from '@smarepo/common'
import { LuSettings2 } from 'react-icons/lu'
import { FlexBox } from '~/components/Base/FlexBox'
import { LoadingAnimation } from '~/components/Base/Loading'
import { IconButton } from '~/components/Buttons/IconButton'
import { FighterSelectorInput } from '~/components/Inputs/FighterSelectorInput'
import { DefaultLayout } from '~/components/Layouts/DefaultLayout'
import { AnalyticsSettingsModal } from '~/features/analytics/components/AnalyticsSettingsModal'
import { MatchUpResultCard } from '~/features/analytics/components/MatchUpResultCard'
import { MatchUpResultEmpty } from '~/features/analytics/components/MatchUpResultEmpty'
import { MatchUpResultListHeader } from '~/features/analytics/components/MatchUpResultListHeader'
import { TotalResultSummary } from '~/features/analytics/components/TotalResultSummary'
import { useAggregateMatchUp } from '~/features/analytics/hooks/useAggregateMatchUp'
import { useMyMatchUpResults } from '~/hooks/useMyMatchUpResults'
import { useToast } from '~/hooks/useToast'
import { unique } from '~/utils/array'
import styles from './style.module.css'

export const AnalyticsContainer = (): React.ReactNode => {
  const { showErrorToast } = useToast()
  const [isOpen, handlers] = useDisclosure()

  const [matchUpResults, error, isLoading] = useMyMatchUpResults()
  const { aggregatedMatchUpResults, myFighterId, setMyFighterId } =
    useAggregateMatchUp(matchUpResults)
  const recentFighters = unique<FighterId>(
    matchUpResults.map((matchUpResult) => matchUpResult.myFighterId),
  ).slice(0, 8)

  if (error) {
    showErrorToast('マッチアップ戦績の取得に失敗しました')
  }

  return (
    <DefaultLayout
      title="マッチアップ分析"
      headerRightIcon={
        <IconButton icon={<LuSettings2 size={24} />} onClick={handlers.open} />
      }
    >
      <div className={styles.analyticsContainer}>
        {isLoading && <LoadingAnimation />}

        {/* マッチアップ結果がある場合 */}
        {aggregatedMatchUpResults.length > 0 && (
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
            <TotalResultSummary
              myFighterId={myFighterId}
              matchUpResults={aggregatedMatchUpResults}
            />
            {aggregatedMatchUpResults.map((matchUpResult) => (
              <MatchUpResultCard
                key={matchUpResult.matchUpResultId}
                matchUpResult={matchUpResult}
              />
            ))}
          </FlexBox>
        )}

        {/* マッチアップ結果が空の場合 */}
        {!isLoading && aggregatedMatchUpResults.length === 0 && (
          <MatchUpResultEmpty />
        )}
      </div>

      <AnalyticsSettingsModal isOpen={isOpen} onClose={handlers.close} />
    </DefaultLayout>
  )
}
