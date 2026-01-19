import type { ReactElement, ReactNode } from 'react'
import { LoadingContentOverlay } from '~/components/Base/Loading'
import { PageHead } from '~/components/Base/PageHead'
import { FixedHeader } from '~/components/Layouts/FixedHeader'
import { FooterNavigation } from '~/components/Layouts/FooterNavigation'
import { useLoadingContext } from '~/providers/LoadingProvider'
import styles from './style.module.css'

type Props = {
  children?: ReactNode
  title?: string
  headerRightIcon?: React.ReactNode
}

export const DefaultLayout = ({
  children,
  title = 'スマレポ',
  headerRightIcon,
}: Props): ReactElement => {
  const { isLoading } = useLoadingContext()

  return (
    <div className={styles.defaultLayout}>
      <PageHead />
      <div className={styles.headerWrapper}>
        <div className={styles.spWindow}>
          <FixedHeader title={title} rightIcon={headerRightIcon} />
        </div>
      </div>

      {isLoading && <LoadingContentOverlay />}
      <main className={styles.main}>{children}</main>

      <div className={styles.footerWrapper}>
        <div className={styles.spWindow}>
          <FooterNavigation />
        </div>
      </div>
    </div>
  )
}
