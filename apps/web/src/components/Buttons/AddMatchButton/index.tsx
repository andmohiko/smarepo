import { BsPlus } from 'react-icons/bs'

import styles from './style.module.css'

type Props = {
  add: () => void
}

export const AddMatchButton = ({ add }: Props): React.ReactElement => {
  return (
    <button className={styles.addMatchButton} onClick={add}>
      <BsPlus size={64} />
    </button>
  )
}
