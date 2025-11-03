import { Button } from '@mantine/core'
import classNames from 'classnames'
import Link from 'next/link'

import styles from './style.module.scss'

import type { ButtonImportance, ButtonSize } from '~/components/Buttons/types'
import { getButtonVariant } from '~/components/Buttons/types'
import { isExternalLink } from '~/components/Base/LinkItem'

type Props = {
  children: React.ReactNode
  onClick?: () => void
  href?: string
  target?: '_self' | '_blank'
  importance?: ButtonImportance
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit'
  width?: string
  fullWidth?: boolean
  shadow?: boolean
}

export const BasicButton = ({
  children,
  onClick,
  href,
  target = '_self',
  importance = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  type = 'button',
  width,
  fullWidth = false,
  shadow = false,
}: Props): React.ReactElement => {
  const buttonClass = classNames(styles[importance], {
    [styles.disabled]: disabled,
  })

  // hrefがあるときはaタグとして動作する
  if (href) {
    return isExternalLink(href) ? (
      <Button
        component="a"
        href={href}
        target={target}
        rel="noreferrer noopener"
        variant={getButtonVariant(importance)}
        disabled={disabled}
        loading={loading}
        w={width}
        fullWidth={fullWidth}
        className={buttonClass}
        size={size}
        style={{
          boxShadow: shadow ? '10px 10px 25px rgba(0, 0, 0, 0.25)' : 'none',
        }}
      >
        {children}
      </Button>
    ) : (
      <Link href={href} target={target}>
        <Button
          component="div"
          variant={getButtonVariant(importance)}
          disabled={disabled}
          loading={loading}
          w={width}
          fullWidth={fullWidth}
          className={buttonClass}
          size={size}
          style={{
            boxShadow: shadow ? '10px 10px 25px rgba(0, 0, 0, 0.25)' : 'none',
          }}
        >
          {children}
        </Button>
      </Link>
    )
  }

  // hrefがなければbuttonとして動作する
  return (
    <Button
      onClick={onClick}
      variant={getButtonVariant(importance)}
      disabled={disabled}
      loading={loading}
      type={type}
      w={width}
      fullWidth={fullWidth}
      className={buttonClass}
      size={size}
      style={{
        boxShadow: shadow ? '10px 10px 25px rgba(0, 0, 0, 0.25)' : 'none',
      }}
    >
      {children}
    </Button>
  )
}
