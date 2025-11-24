import 'source-map-support/register'

import { onRequest } from 'firebase-functions/v2/https'
import app from './router'
import { onCreatePublicMatch } from './triggers/onCreatePublicMatch'
import { onUpdatePublicMatch } from './triggers/onUpdatePublicMatch'
import { onDeletePublicMatch } from './triggers/onDeletePublicMatch'

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
