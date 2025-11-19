import Link from 'next/link'
import { useRouter } from 'next/router'
import { AiOutlineUser } from 'react-icons/ai'
import { IoAnalyticsOutline } from 'react-icons/io5'
import { RiSwordLine } from 'react-icons/ri'
import { useMyProfile } from '~/hooks/useMyProfile'
import styles from './style.module.css'

export const FooterNavigation = (): React.ReactNode => {
  const { pathname } = useRouter()
  const [profile] = useMyProfile()
  const footerItems: Array<NavigationItemProps> = [
    {
      href: '/',
      label: 'オンライン戦績',
      icon: <RiSwordLine size={24} />,
      isCurrent: pathname === '/',
      isDisabled: false,
    },
    {
      href: '/i/analytics',
      label: '分析',
      icon: <IoAnalyticsOutline size={24} />,
      isCurrent: pathname === '/i/analytics',
      isDisabled: true,
    },
    {
      href: '/i/mypage',
      label: 'マイページ',
      icon: <AiOutlineUser size={24} />,
      isCurrent: pathname === `/${profile?.username}`,
      isDisabled: false,
    },
  ]

  return (
    <nav className={styles.bottomFooter}>
      {footerItems.map((item) => (
        <NavigationItem key={item.href} {...item} />
      ))}
    </nav>
  )
}

type NavigationItemProps = {
  href: string
  label: string
  icon: React.ReactNode
  isCurrent: boolean
  isDisabled: boolean
}

const NavigationItem = ({
  href,
  label,
  icon,
  isCurrent,
  isDisabled,
}: NavigationItemProps): React.ReactNode => {
  return (
    <Link
      className={styles.navigationItem}
      href={isDisabled ? '#' : href}
      style={{
        color: isCurrent ? '#0593b9' : undefined,
        textDecoration: 'none',
      }}
    >
      {icon}
      <span className={styles.label}>{label}</span>

      {isDisabled && (
        <div className={styles.disabled}>
          <p className={styles.comingSoon}>
            coming
            <br />
            soon
          </p>
        </div>
      )}
    </Link>
  )
}
