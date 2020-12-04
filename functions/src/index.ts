import * as functions from 'firebase-functions'
import * as express from 'express'
import * as cors from 'cors'
import * as helmet from 'helmet'
import subscribeHandler from './routes/subscribe'
import unsubscribeHandler from './routes/unsubscribe'


const app = express()

app.use(cors())
app.use(helmet())
app.use(express.json())

app.post('/subscribe', subscribeHandler)
app.post('/unsubscribe', unsubscribeHandler)


// Newsletter Service Entry Point
export const newsletter = functions.https.onRequest(app);

