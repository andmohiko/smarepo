import type { NextPage } from 'next'
import { NonAuthLayout } from '~/components/Layouts/NonAuthLayout'
import { NewContainer } from '~/features/new/components/NewContainer'

const NewPage: NextPage = () => {
  return (
    <NonAuthLayout>
      <NewContainer />
    </NonAuthLayout>
  )
}

export default NewPage
