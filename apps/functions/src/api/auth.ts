import type { LoggedInRequest, NextFunction, Response } from 'express'

import { auth } from '~/lib/firebase'

exports.handle = async (
  req: LoggedInRequest,
  _res: Response,
  next: NextFunction,
) => {
  try {
    // biome-ignore lint/complexity/useLiteralKeys: <explanation> headers is object
    const authHeader = req.headers['authorization']
    if (!authHeader) {
      return next()
    }
    const token = (
      typeof authHeader === 'string' ? authHeader : authHeader[0]
    ).split(' ')[1]
    const decodedToken = await auth.verifyIdToken(token)
    if (!decodedToken?.uid) {
      return next()
    }
    req.currentUser = decodedToken
    return next()
  } catch (_) {
    return next()
  }
}
