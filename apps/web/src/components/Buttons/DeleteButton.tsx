import { Button } from '@mantine/core'

import type { ButtonImportance, ButtonSize } from '~/components/Buttons/types'
import { getButtonVariant } from '~/components/Buttons/types'

type Props = {
  children: React.ReactNode
  onClick?: () => void
  href?: string
  target?: '_self' | '_blank'
  importance?: ButtonImportance
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  width?: string
  fullWidth?: boolean
  leftSection?: React.ReactNode
}

export const DeleteButton = ({
  children,
  onClick,
  importance = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  width,
  fullWidth = false,
  leftSection,
}: Props): React.ReactElement => {
  return (
    <Button
      onClick={onClick}
      color="red"
      variant={getButtonVariant(importance)}
      disabled={disabled}
      loading={loading}
      w={width}
      fullWidth={fullWidth}
      size={size}
      leftSection={leftSection}
    >
      {children}
    </Button>
  )
}
