import { FlexBox } from '~/components/Base/FlexBox'
import {
  SkeletonCircle,
  SkeletonRectangle,
} from '~/components/Displays/Skeleton'

export const ProfileContainerSkeleton = (): React.ReactNode => {
  return (
    <FlexBox gap={16} py={16} align="flex-start">
      <FlexBox direction="row" justify="flex-start">
        <SkeletonCircle size={132} />
      </FlexBox>
      <FlexBox gap={8} align="flex-start" mt={8}>
        <SkeletonRectangle height={18} width="40%" />
        <SkeletonRectangle height={12} width="30%" />
      </FlexBox>
      <SkeletonRectangle height={12} width="100%" />
      <SkeletonRectangle height={12} width="100%" />
      <SkeletonRectangle height={12} width="100%" />
      <SkeletonRectangle height={12} width="100%" />
      <SkeletonRectangle height={12} width="100%" />
    </FlexBox>
  )
}
