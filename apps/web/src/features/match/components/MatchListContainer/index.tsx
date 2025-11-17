import { Fragment, useState } from 'react'
import { useDisclosure } from '@mantine/hooks'
import dayjs from 'dayjs'
import type { PublicMatch } from '@smarepo/common'

import styles from './style.module.css'

import { MatchEmpty } from '~/features/match/components/MatchEmpty'
import { MatchListSummary } from '~/features/match/components/MatchListSummary'
import { MatchListCard } from '~/features/match/components/MatchListCard'
import { FlexBox } from '~/components/Base/FlexBox'
import { LoadingAnimation } from '~/components/Base/Loading'
import { useToast } from '~/hooks/useToast'
import { isSameDay } from '~/utils/date'
import { usePublicMatches } from '~/hooks/usePublicMatches'
import { AddMatchButton } from '~/components/Buttons/AddMatchButton'
import { EditMatchModal } from '~/features/match/components/EditMatchModal'
import { MatchListHeader } from '~/features/match/components/MatchListHeader'
import { LabelText } from '~/components/Typography/LabelText'

export const MatchListContainer = (): React.ReactElement => {
  const { showErrorToast } = useToast()
  const [matches, error, isLoading] = usePublicMatches()
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

  const onEdit = (match: PublicMatch) => {
    setCurrentMatch(match)
    editModalHandlers.open()
  }

  return (
    <div className={styles.matchListContainer}>
      {isLoading && <LoadingAnimation />}

      {/* 戦績がある場合 */}
      {matches.length > 0 && (
        <>
          <MatchListSummary matches={matches} />
          <FlexBox align="center">
            {/* ヘッダー */}
            <MatchListHeader />
            {matches.map((match, i) => (
              <Fragment key={match.publicMatchId}>
                {/* 日付が変わったタイミングで日付を表示する */}
                {isShowDate(i) && (
                  <FlexBox pl={16} align="stretch" pt={16}>
                    <LabelText color="gray" weight="bold" size="md">
                      {dayjs(match.createdAt).format('MM/DD')}
                    </LabelText>
                  </FlexBox>
                )}
                <MatchListCard match={match} onEdit={() => onEdit(match)} />
              </Fragment>
            ))}
          </FlexBox>
        </>
      )}

      <div className={styles.addMatchButtonContainer}>
        <AddMatchButton add={editModalHandlers.open} />
      </div>

      {/* 戦績が空の場合 */}
      {!isLoading && matches.length === 0 && <MatchEmpty />}

      <EditMatchModal
        isOpen={isOpenEditModal}
        onClose={editModalHandlers.close}
        match={currentMatch}
      />
    </div>
  )
}
