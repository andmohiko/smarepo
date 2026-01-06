import { useDisclosure } from '@mantine/hooks'
import type { PublicMatch } from '@smarepo/common'
import dayjs from 'dayjs'
import { Fragment, useState } from 'react'
import { FlexBox } from '~/components/Base/FlexBox'
import { InfiniteScroller } from '~/components/Base/InfiniteScroller'
import { LoadingAnimation } from '~/components/Base/Loading'
import { LabelText } from '~/components/Typography/LabelText'
import { EditMatchModal } from '~/features/match/components/EditMatchModal'
import { MatchEmpty } from '~/features/match/components/MatchEmpty'
import { MatchListCard } from '~/features/match/components/MatchListCard'
import { MatchListFooter } from '~/features/match/components/MatchListFooter'
import { MatchListHeader } from '~/features/match/components/MatchListHeader'
import { MatchListSummary } from '~/features/match/components/MatchListSummary'
import { usePublicMatches } from '~/hooks/usePublicMatches'
import { useToast } from '~/hooks/useToast'
import { isSameDay } from '~/utils/date'
import styles from './style.module.css'

/**
 * 戦績一覧コンテナコンポーネント
 * - 無限スクロールによるページネーション対応
 * - 最初のページはリアルタイム購読、追加ページはフェッチで取得
 */
export const MatchListContainer = (): React.ReactElement => {
  const { showErrorToast } = useToast()
  const { matches, error, isLoading, isLoadingMore, hasMore, loadMore } =
    usePublicMatches()
  const [isOpenEditModal, editModalHandlers] = useDisclosure()
  const [currentMatch, setCurrentMatch] = useState<PublicMatch | null>(null)

  if (error) {
    showErrorToast('戦績の取得に失敗しました')
  }

  /**
   * 日付区切りを表示するかどうか判定
   * @param i - 現在のインデックス
   * @returns 日付を表示する場合はtrue
   */
  const isShowDate = (i: number): boolean => {
    return (
      i === 0 ||
      !isSameDay(
        new Date(matches[i].createdAt),
        new Date(matches[i - 1].createdAt),
      )
    )
  }

  const onCloseModel = () => {
    setCurrentMatch(null)
    editModalHandlers.close()
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
          <FlexBox align="center" mb={64}>
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

            {/* 無限スクロール */}
            <InfiniteScroller
              isLoadingMore={isLoadingMore}
              hasMore={hasMore}
              isLoading={isLoading}
              loadMore={loadMore}
              dataLength={matches.length}
              endMessage="すべての戦績を表示しました"
            />
          </FlexBox>
        </>
      )}

      <div className={styles.matchListFooterContainer}>
        <MatchListFooter matches={matches} add={editModalHandlers.open} />
      </div>

      {/* 戦績が空の場合 */}
      {!isLoading && matches.length === 0 && <MatchEmpty />}

      <EditMatchModal
        isOpen={isOpenEditModal}
        onClose={onCloseModel}
        match={currentMatch}
        isFirstMatch={matches.length === 0}
      />
    </div>
  )
}
