import { check } from 'express-validator'

const cors = require('cors')({ origin: true })
const express = require('express')
const app = express()

app.use(cors)
app.use(express.json())

const router = require('express-promise-router')()

router.post(
  '/health',
  [check('message').exists()],
  require('./api/health/test').handle,
)

// 認証が必要なAPI
router.use(require('./api/auth').handle)

// ユーザー名が有効かどうかを取得するAPI
router.post(
  '/user/username',
  [check('username').exists()],
  require('./api/user/username').handle,
)

app.use(router)

export default app
