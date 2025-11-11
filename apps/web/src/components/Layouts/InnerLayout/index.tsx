import type { ReactElement, ReactNode } from 'react'

import styles from './style.module.css'

import { LoadingContentOverlay } from '~/components/Base/Loading'
import { useLoadingContext } from '~/providers/LoadingProvider'
import { FixedHeader } from '~/components/Layouts/FixedHeader'
import { PageHead } from '~/components/Base/PageHead'

type Props = {
  children?: ReactNode
  title?: string
}

export const InnerLayout = ({
  children,
  title = 'スマレポ',
}: Props): ReactElement => {
  const { isLoading } = useLoadingContext()

  return (
    <div className={styles.simpleLayout}>
      <PageHead />
      <div className={styles.headerWrapper}>
        <div className={styles.spWindow}>
          <FixedHeader title={title} isShowBackButton />
        </div>
      </div>

      {isLoading && <LoadingContentOverlay />}
      <main className={styles.main}>{children}</main>
    </div>
  )
}
