import 'source-map-support/register'

import { onRequest } from 'firebase-functions/v2/https'
import app from './router'
import { onCreatePublicMatch } from './triggers/onCreatePublicMatch'
import { onDeletePublicMatch } from './triggers/onDeletePublicMatch'
import { onUpdatePublicMatch } from './triggers/onUpdatePublicMatch'

const timezone = 'Asia/Tokyo'
process.env.TZ = timezone

// triggers
export { onCreatePublicMatch, onUpdatePublicMatch, onDeletePublicMatch }

// API
export const api = onRequest(
  {
    memory: '1GiB',
  },
  app,
)
