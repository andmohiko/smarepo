import type { ReactElement, ReactNode } from 'react'

import styles from './style.module.css'

import { LoadingContentOverlay } from '~/components/Base/Loading'
import { useLoadingContext } from '~/providers/LoadingProvider'
import { FixedHeader } from '~/components/Layouts/FixedHeader'
import { PageHead } from '~/components/Base/PageHead'
import { BottomFooter } from '~/components/Layouts/BottomFooter'

type Props = {
  children?: ReactNode
  title?: string
}

export const DefaultLayout = ({
  children,
  title = 'スマレポ',
}: Props): ReactElement => {
  const { isLoading } = useLoadingContext()

  return (
    <div className={styles.defaultLayout}>
      <PageHead />
      <div className={styles.headerWrapper}>
        <div className={styles.spWindow}>
          <FixedHeader title={title} />
        </div>
      </div>

      {isLoading && <LoadingContentOverlay />}
      <main className={styles.main}>{children}</main>

      <div className={styles.footerWrapper}>
        <div className={styles.spWindow}>
          <BottomFooter />
        </div>
      </div>
    </div>
  )
}
