> I recorded how I built this whole project here: https://newsletter-course.gdelgado.ca/

### Project Structure

- `emails/` directory
  - Contains the actual content of the newsletter that I send out to subscribers
  - It is built with mjml which

- `functions/` directory
  - Contains the server-side logic for subscribing, unsubscribing and sending the newsletter.

- `landing-page/` directory
  - Marketing page for my [newsletter app youtube series](https://newsletter-course.gdelgado.ca/).



### Getting Set Up

- Run `firbase init` to connect this repo to your own firebase project

You'll need a `.firebaserc` located in the `functions/` directory

```
{
  "projects": {
    "default": "newsletter-app-190ba"
  }
}
```

- Add a `.runtimeconfig.json` file to your `functions/` directory. This will represent your local environment variables.

```
{
  "newsletter": {
    "mailgun_api_token": "<YOUR_MAILGUN_API_TOKEN>",
    "email_sender_domain": "<YOUR_EMAIL_SENDER_DOMAIN>"
  }
}
```

Deploying in production requires that you [add environment variables](https://firebase.google.com/docs/functions/config-env) to your firebase project.

