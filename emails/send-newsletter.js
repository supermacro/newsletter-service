const axios = require('axios')
const FormData = require('form-data');
const fs = require('fs')
 
const form = new FormData();
form.append('email', fs.createReadStream('./dist/index.html'));

axios.post(
  'http://localhost:5001/newsletter-app-190ba/us-central1/newsletter/send-newsletter',
  form,
  {
    headers: {
      ...form.getHeaders(),
      Authorization: 'c07f2e61-3d9a-457c-86c4-5cbfb1c7de87'
    }
  }
)
  .then(() => console.log('ok'))
  .catch((err) => console.log(err))


