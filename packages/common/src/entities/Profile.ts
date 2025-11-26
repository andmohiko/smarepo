import type { FieldValue } from 'firebase/firestore'

import type { UserId } from './User'

export type VoiceChat = {
  discord: boolean
  line: boolean
  nintendoOnline: boolean
  listenOnly: boolean
}

export const profileCollection = 'profiles' as const

export type ProfileId = UserId

export type Profile = {
  profileId: ProfileId
  createdAt: Date
  displayName: string
  friendCode: string
  isPrivateProfile: boolean
  mainFighter: string
  mainPlayingTime: string
  ogpImageUrl: string | null
  profileImageUrl: string
  selfIntroduction: string
  smashMateMaxRating: number | null
  updatedAt: Date
  username: string
  voiceChat: VoiceChat
  xId: string
}

export type CreateProfileDto = Omit<
  Profile,
  'profileId' | 'createdAt' | 'updatedAt'
> & {
  createdAt: FieldValue
  updatedAt: FieldValue
}

export type UpdateProfileDto = {
  displayName: Profile['displayName']
  friendCode: Profile['friendCode']
  isPrivateProfile: Profile['isPrivateProfile']
  mainFighter: Profile['mainFighter']
  mainPlayingTime: Profile['mainPlayingTime']
  profileImageUrl: Profile['profileImageUrl']
  selfIntroduction: Profile['selfIntroduction']
  smashMateMaxRating: Profile['smashMateMaxRating']
  updatedAt: FieldValue
  username: Profile['username']
  voiceChat: Profile['voiceChat']
  xId: Profile['xId']
}

export type SerializedProfile = Omit<Profile, 'createdAt' | 'updatedAt'> & {
  createdAt: string | null
  updatedAt: string | null
}
