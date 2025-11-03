import styles from './style.module.css'

import { LabelText } from '~/components/Typography/LabelText'
import { ParagraphText } from '~/components/Typography/ParagraphText'

type Props = {
  icon: React.ReactNode
  title: string
  description: string
  action: React.ReactNode
}

export const EmptyState = ({ icon, title, description, action }: Props) => {
  return (
    <div className={styles.emptyState}>
      {icon}
      <div className={styles.texts}>
        <LabelText size="lg" weight="bold">
          {title}
        </LabelText>
        <ParagraphText size="sm">{description}</ParagraphText>
      </div>
      <div className={styles.action}>{action}</div>
    </div>
  )
}
