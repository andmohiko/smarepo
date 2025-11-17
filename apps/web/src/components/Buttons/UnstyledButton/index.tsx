import styles from './style.module.scss'

type Props = {
  children: React.ReactNode
  onClick: () => void
  width?: string
}

export const UnstyledButton = ({
  children,
  onClick,
  width,
}: Props): React.ReactElement => {
  return (
    <button
      className={styles.unstyledButton}
      onClick={onClick}
      style={{
        width,
      }}
    >
      {children}
    </button>
  )
}
