> I recorded how I built this whole project here: https://newsletter-course.gdelgado.ca/

### Getting Set Up

- Run `firbase init` to connect this repo to your own firebase project

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

