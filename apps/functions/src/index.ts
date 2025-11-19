import 'source-map-support/register'

import * as functions from 'firebase-functions/v1'

import router from './router'
import { onCreatePublicMatch } from './triggers/onCreatePublicMatch'
import { onUpdatePublicMatch } from './triggers/onUpdatePublicMatch'

const cors = require('cors')({ origin: true })
const express = require('express')
const app = express()

const timezone = 'Asia/Tokyo'
process.env.TZ = timezone

app.use(cors)
app.use(router)

// triggers
export { onCreatePublicMatch, onUpdatePublicMatch }

// API
exports.api = functions
  .runWith({
    memory: '1GB' as const,
  })
  .https.onRequest(app)
