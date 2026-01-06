import { useIntersection } from '@mantine/hooks'
import { useEffect } from 'react'
import { LoadingAnimation } from '~/components/Base/Loading'
import { LabelText } from '~/components/Typography/LabelText'
import styles from './style.module.css'

/**
 * InfiniteScrollerコンポーネントのProps
 */
type Props = {
  /** 追加読み込み中かどうか */
  isLoadingMore: boolean
  /** 追加データがあるかどうか */
  hasMore: boolean
  /** 初回ローディング中かどうか（初回ローディング中は追加読み込みしない） */
  isLoading?: boolean
  /** 追加データを読み込む関数 */
  loadMore: () => Promise<void>
  /** データ件数（終端メッセージ表示判定に使用） */
  dataLength: number
  /** 終端メッセージ（デフォルト: 'すべてのデータを表示しました'） */
  endMessage?: string
}

/**
 * 無限スクロールコンポーネント
 * - Intersection Observerでスクロール末尾を検出
 * - 自動で追加読み込みを実行
 * - ローディング状態と終端メッセージを表示
 */
export const InfiniteScroller = ({
  isLoadingMore,
  hasMore,
  isLoading = false,
  loadMore,
  dataLength,
  endMessage = 'すべてのデータを表示しました',
}: Props): React.ReactElement => {
  // Intersection Observer
  const { ref, entry } = useIntersection({
    root: null,
    threshold: 0.1,
  })

  // スクロール末尾が表示されたら追加読み込み
  useEffect(() => {
    if (entry?.isIntersecting && hasMore && !isLoadingMore && !isLoading) {
      loadMore()
    }
  }, [entry?.isIntersecting, hasMore, isLoadingMore, isLoading, loadMore])

  return (
    <div ref={ref} className={styles.infiniteScroller}>
      {isLoadingMore && (
        <div className={styles.loading}>
          <LoadingAnimation />
        </div>
      )}
      {!hasMore && dataLength > 0 && (
        <div className={styles.endMessage}>
          <LabelText color="gray" size="sm">
            {endMessage}
          </LabelText>
        </div>
      )}
    </div>
  )
}
