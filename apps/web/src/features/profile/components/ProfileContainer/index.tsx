import type { FighterId, Profile } from '@smarepo/common'
import Image from 'next/image'
import { FaXTwitter } from 'react-icons/fa6'
import { FlexBox } from '~/components/Base/FlexBox'
import { BasicButton } from '~/components/Buttons/BasicButton'
import { DisplayItem } from '~/components/Displays/DisplayItem'
import { FighterIcon } from '~/components/Displays/FighterIcon'
import {
  SkeletonCircle,
  SkeletonRectangle,
} from '~/components/Displays/Skeleton'
import { HeadingText } from '~/components/Typography/HeadingText'
import { ParagraphText } from '~/components/Typography/ParagraphText'
import styles from './style.module.css'

type Props = {
  profile: Profile
  isMyPage?: boolean
}

export const ProfileContainer = ({
  profile,
  isMyPage = false,
}: Props): React.ReactNode => {
  return (
    <FlexBox gap={16} py={16} align="flex-start">
      <FlexBox direction="row" justify="space-between">
        <Image
          src={profile.profileImageUrl}
          alt={profile.displayName}
          className={styles.profileImage}
          width={132}
          height={132}
          priority
          unoptimized
        />
        {isMyPage && (
          <BasicButton href="/i/edit" importance="secondary" size="sm">
            プロフィールを編集
          </BasicButton>
        )}
      </FlexBox>
      <FlexBox gap={0} align="flex-start">
        <HeadingText size="md">{profile.displayName}</HeadingText>
        <ParagraphText color="darkGray">{`@${profile.username}`}</ParagraphText>
      </FlexBox>
      <FlexBox direction="row" gap={4} justify="flex-start">
        <FaXTwitter />
        <ParagraphText
          color="darkGray"
          size="sm"
        >{`@${profile.xId}`}</ParagraphText>
      </FlexBox>
      <ParagraphText>{profile.selfIntroduction}</ParagraphText>
      <FlexBox gap={8} align="flex-start">
        <DisplayItem
          label="メインファイター"
          value={
            <div className={styles.fighterIconContainer}>
              <FighterIcon
                fighterId={profile.mainFighter as FighterId}
                size="md"
              />
            </div>
          }
        />
      </FlexBox>
    </FlexBox>
  )
}

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
