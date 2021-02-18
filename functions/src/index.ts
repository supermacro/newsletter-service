import * as functions from 'firebase-functions'
import * as express from 'express'
import * as cors from 'cors'
import * as helmet from 'helmet'
import { AUTH_SECRET } from './env'
import { createAuthorizationMiddleware } from './middleware'
import subscribeHandler from './routes/subscribe'
import unsubscribeHandler from './routes/unsubscribe'
import sendNewsletterHandler from './routes/send-newsletter'


const app = express()

app.use(cors())
app.use(helmet())

app.post('/subscribe', express.json(), subscribeHandler)
app.post('/unsubscribe', express.json(), unsubscribeHandler)
app.post(
  '/send-newsletter',
  createAuthorizationMiddleware(AUTH_SECRET),
  sendNewsletterHandler
)

// Newsletter Service Entry Point
export const newsletter = functions.https.onRequest(app);

