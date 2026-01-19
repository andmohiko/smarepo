import { Modal, ScrollArea } from '@mantine/core'
import { HeadingText } from '~/components/Typography/HeadingText'
import styles from './style.module.css'

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
      title={<HeadingText size="sm">{title}</HeadingText>}
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
