import { NavLink as MantineNavLink } from '@mantine/core'
import Link from 'next/link'
import { TbChevronRight } from 'react-icons/tb'

import styles from './style.module.css'

import { isExternalLink } from '~/components/Base/LinkItem'

type Props = {
  label: string
  href: string
  target?: '_self' | '_blank'
  onClick?: () => void
}

export const NavLink = ({
  label,
  href,
  target = '_self',
  onClick,
}: Props): React.ReactElement => {
  return isExternalLink(href) ? (
    <a
      href={href}
      target={target}
      className={styles.navLink}
      rel="noreferrer noopener"
      onClick={onClick}
    >
      <MantineNavLink
        component="span"
        label={label}
        rightSection={<TbChevronRight />}
        className={styles.mantineNavLink}
      />
    </a>
  ) : (
    <Link
      href={href}
      target={target}
      className={styles.navLink}
      onClick={onClick}
    >
      <MantineNavLink
        component="span"
        label={label}
        rightSection={<TbChevronRight />}
        className={styles.mantineNavLink}
      />
    </Link>
  )
}
