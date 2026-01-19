import { useRouter } from 'next/router'
import { FaChevronLeft } from 'react-icons/fa6'
import { IconButton } from '~/components/Buttons/IconButton'
import styles from './style.module.css'

type Props = {
  title: string
  isShowBackButton?: boolean
  rightIcon?: React.ReactNode
}

export const FixedHeader = ({
  title,
  isShowBackButton = false,
  rightIcon,
}: Props): React.ReactNode => {
  const { pathname, push } = useRouter()

  const back = () => {
    // プロフィール編集画面いるときはマイページに戻る
    if (pathname === '/i/edit') {
      push('/i/mypage')
      return
    }
    // 設定画面いるときはマイページに戻る
    if (pathname === '/i/settings') {
      push('/i/mypage')
      return
    }
    // 退会画面いるときは設定画面に戻る
    if (pathname.startsWith('/i/delete')) {
      push('/i/settings')
      return
    }

    push('/')
  }

  return (
    <header className={styles.fixedHeader}>
      {isShowBackButton ? (
        <div className={styles.leftIcon}>
          <IconButton icon={<FaChevronLeft size={24} />} onClick={back} />
        </div>
      ) : (
        <div />
      )}
      <h1 className={styles.title}>{title}</h1>
      {rightIcon ? (
        <div className={styles.rightIcon}>{rightIcon}</div>
      ) : (
        <div />
      )}
    </header>
  )
}
