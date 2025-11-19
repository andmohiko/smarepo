import { ParagraphText } from '~/components/Typography/ParagraphText'
import styles from './style.module.css'

export const NewContainer = (): React.ReactNode => {
  return (
    <div className={styles.newContainer}>
      <div className={styles.hero}>
        <div className={styles.heroTexts}>
          <ParagraphText size="lg" weight="bold">
            Coming Soon!
            <br />
            β版なのでバグがあっても許してね
          </ParagraphText>
        </div>
      </div>
    </div>
  )
}
