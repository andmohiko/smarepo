import { ActionIcon } from '@mantine/core'

import styles from './style.module.scss'
import type { ButtonImportance } from './types'
import { getButtonVariant } from './types'

type Props = {
  icon: React.ReactNode
  onClick?: () => void
  importance?: ButtonImportance
  disabled?: boolean
  loading?: boolean
}

export const IconButton = ({
  icon,
  onClick,
  importance = 'primary',
  disabled = false,
  loading = false,
}: Props): React.ReactElement => {
  return (
    <ActionIcon
      onClick={onClick}
      variant={getButtonVariant(importance)}
      disabled={disabled}
      loading={loading}
      className={styles[importance]}
    >
      {icon}
    </ActionIcon>
  )
}
