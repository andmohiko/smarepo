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
  profileImageUrl: string
  selfIntroduction: string
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
  updatedAt: FieldValue
}
