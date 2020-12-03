import * as functions from 'firebase-functions';
import { addSubscriberToMailingList } from './email'

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest(async (request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});

  const user = 'henry@example.com' 
  await addSubscriberToMailingList(user)

  response.send(`Successfully added ${user} to mailing list`);
});
