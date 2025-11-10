import { Fragment, useState } from 'react'
import { useDisclosure } from '@mantine/hooks'
import dayjs from 'dayjs'
import type { PublicMatch } from '@smarepo/common'

import { MatchEmpty } from '~/features/match/components/MatchEmpty'
import { MatchListSummary } from '~/features/match/components/MatchListSummary'
import { MatchListCard } from '~/features/match/components/MatchListCard'
import { FlexBox } from '~/components/Base/FlexBox'
import { LoadingAnimation } from '~/components/Base/Loading'
import { useToast } from '~/hooks/useToast'
import { BaseText } from '~/components/Typography/BaseText'
import { isSameDay } from '~/utils/date'
import { usePublicMatches } from '~/hooks/usePublicMatches'

export const MatchListContainer = (): React.ReactElement => {
  const { showErrorToast, showSuccessToast } = useToast()
  const [matches, error, isLoading] = usePublicMatches()
  const [isOpen, handlers] = useDisclosure()
  const [isOpenDeleteModal, deleteModalHandlers] = useDisclosure()
  const [isOpenEditModal, editModalHandlers] = useDisclosure()
  const [currentMatch, setCurrentMatch] = useState<PublicMatch | null>(null)

  if (error) {
    showErrorToast('戦績の取得に失敗しました')
  }

  const isShowDate = (i: number): boolean => {
    return (
      i === 0 ||
      !isSameDay(
        new Date(matches[i].createdAt),
        new Date(matches[i - 1].createdAt),
      )
    )
  }

  return (
    <FlexBox px={8} py={16}>
      {isLoading && <LoadingAnimation />}

      {/* 戦績がある場合 */}
      {matches.length > 0 && (
        <>
          <MatchListSummary matches={matches} />
          <FlexBox align="stretch">
            {matches.map((match, i) => (
              <Fragment key={match.publicMatchId}>
                {/* 日付が変わったタイミングで日付を表示する */}
                {isShowDate(i) && (
                  <FlexBox pl={0} align="stretch" pt={16}>
                    <BaseText color="gray" weight="bold" size="lg">
                      {dayjs(match.createdAt).format('MM/DD')}
                    </BaseText>
                  </FlexBox>
                )}
                <MatchListCard match={match} />
              </Fragment>
            ))}
          </FlexBox>
        </>
      )}

      {/* 戦績が空の場合 */}
      {!isLoading && matches.length === 0 && <MatchEmpty />}
    </FlexBox>
  )
}
