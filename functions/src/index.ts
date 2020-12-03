import * as functions from 'firebase-functions';
import { PLACEHOLDER } from './env'

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});

  console.log(PLACEHOLDER)

  response.send("Hello from Giorgio!");
});
