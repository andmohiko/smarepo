import { Modal, ScrollArea } from '@mantine/core'

import styles from './style.module.css'

import { BaseText } from '~/components/Typography/BaseText'

type Props = {
  children: React.ReactNode
  title: string
  isOpen: boolean
  onClose: () => void
}

export const BaseBottomSheet = ({
  children,
  title,
  isOpen,
  onClose,
}: Props) => {
  return (
    <Modal
      title={
        <BaseText weight="bold" size="xl">
          {title}
        </BaseText>
      }
      opened={isOpen}
      onClose={onClose}
      withCloseButton
      fullScreen
      transitionProps={{
        transition: 'slide-up',
        duration: 400,
        timingFunction: 'ease',
      }}
      overlayProps={{
        color: '#000000',
        opacity: 0.3,
        blur: 3,
      }}
      padding="lg"
      scrollAreaComponent={ScrollArea.Autosize}
      classNames={{
        root: styles.mantineModalRoot,
        inner: styles.mantineModalInner,
        content: styles.mantineModalContent,
      }}
    >
      {children}
    </Modal>
  )
}
