import styles from './style.module.css'

type Props = {
  label: string
  value: string | number | null | undefined | React.ReactNode
  unit?: string
}

export const DisplayItem = ({ label, value, unit }: Props) => {
  return value ? (
    <div className={styles.displayItem}>
      <p className={styles.label}>{label}</p>
      {typeof value === 'string' || typeof value === 'number' ? (
        <p className={styles.value}>
          {`${value}`}
          {unit && <span className={styles.unit}>{unit}</span>}
        </p>
      ) : (
        value
      )}
    </div>
  ) : (
    <></>
  )
}
