import { Skeleton } from '@mantine/core'

type SkeletonCircleProps = {
  size: number
}

export const SkeletonCircle = ({
  size,
}: SkeletonCircleProps): React.ReactNode => {
  return <Skeleton height={size} circle />
}

type SkeletonRectangleProps = {
  height: number
  width?: string
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export const SkeletonRectangle = ({
  height,
  width = '100%',
  radius = 'xl',
}: SkeletonRectangleProps): React.ReactNode => {
  return <Skeleton height={height} width={width} radius={radius} />
}
