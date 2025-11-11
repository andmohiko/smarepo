import { Divider } from '@mantine/core'

type Props = {
  orientation: 'horizontal' | 'vertical'
}

export const BorderLine = ({ orientation }: Props): React.ReactNode => {
  return <Divider orientation={orientation} />
}
