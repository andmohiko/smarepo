import { userNgWords } from '@smarepo/common'
import type { LoggedInRequest, Response } from 'express'
import { validationResult } from 'express-validator'
import { isExistsProfileByUsernameOperation } from '~/infrastructure/firestore/ProfileOperations'

/**
 * ユーザー名が有効かどうかを取得するAPI
 */
exports.handle = async (req: LoggedInRequest, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    const { currentUser, body } = req
    if (!currentUser) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    const { username } = body
    if (!username) {
      return res.status(400).json({ error: 'Username is required' })
    }

    // NGワードが含まれていないか判定する
    const isNgWord = userNgWords.some((word) => username.includes(word))
    if (isNgWord) {
      return res.status(200).json({ isValid: false })
    }
    // ユーザー名がすでに存在していないか判定する
    const isExists = await isExistsProfileByUsernameOperation(username)
    return res.status(200).send({ isValid: !isExists })
  } catch (error) {
    console.error(error)
    return res.status(500).send({ error })
  }
}
