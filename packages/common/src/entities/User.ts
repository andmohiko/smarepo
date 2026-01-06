import type { FieldValue } from 'firebase/firestore'

import type { Uid } from './Auth'

export type UserId = Uid

export const userCollection = 'users' as const

export type User = {
  userId: UserId
  createdAt: Date
  email: string
  updatedAt: Date
}

export type CreateUserDto = Omit<User, 'userId' | 'createdAt' | 'updatedAt'> & {
  createdAt: FieldValue
  updatedAt: FieldValue
}

export type UpdateUserDto = {
  updatedAt: FieldValue
}
