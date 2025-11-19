import { Accordion as MantineAccordion } from '@mantine/core'
import { FaPlus } from 'react-icons/fa'
import { LabelText } from '~/components/Typography/LabelText'
import styles from './style.module.css'

type AccordionItem = {
  value: string
  label: React.ReactNode
  children: React.ReactNode
}

type Props = {
  items: AccordionItem[]
}

export const Accordion = ({ items }: Props) => {
  return (
    <MantineAccordion
      defaultValue=""
      chevron={<FaPlus size={18} color="var(--color-gray600)" />}
      classNames={{
        control: styles.accordionControl,
        chevron: styles.accordionChevron,
      }}
    >
      {items.map((item) => (
        <MantineAccordion.Item key={item.value} value={item.value}>
          <MantineAccordion.Control>
            <LabelText size="md" weight="bold">
              {item.label}
            </LabelText>
          </MantineAccordion.Control>
          <MantineAccordion.Panel>{item.children}</MantineAccordion.Panel>
        </MantineAccordion.Item>
      ))}
    </MantineAccordion>
  )
}
