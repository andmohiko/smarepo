import type { NextPage } from 'next'
import { InnerLayout } from '~/components/Layouts/InnerLayout'
import { EditProfileContainer } from '~/features/profile/components/EditProfileContainer'

const EditPage: NextPage = () => {
  return (
    <InnerLayout>
      <EditProfileContainer />
    </InnerLayout>
  )
}

export default EditPage
