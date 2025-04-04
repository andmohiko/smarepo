import styles from './style.module.scss'

import { FixedHeader } from '~/components/Layouts/FixedHeader'
import { LoadingContentOverlay } from '~/components/Base/Loading'
import { useLoadingContext } from '~/providers/LoadingProvider'
import { PageHead } from '~/components/Base/PageHead'

type Props = {
  children?: React.ReactNode
  title?: string
}

export const NonAuthLayout = ({
  children,
  title = 'スマレポ',
}: Props): React.ReactNode => {
  const { isLoading } = useLoadingContext()
  return (
    <div className={styles.nonAuthLayout}>
      <PageHead />
      <div className={styles.headerWrapper}>
        <div className={styles.spWindow}>
          <FixedHeader title={title} />
        </div>
      </div>

      {isLoading && <LoadingContentOverlay />}
      <main className={styles.main}>{children}</main>
    </div>
  )
}
