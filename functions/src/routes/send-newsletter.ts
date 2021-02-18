import { createRoute, Validator } from '../router'
import { isString, intoHandlerResult } from '../utils'
import { sendNewsletter } from '../email'
import { readFileSync } from 'fs'
import { Octokit } from '@octokit/rest'


const github = new Octokit()

github.repos.getContent({
  owner: 'supermacro',
  repo: 'newsletter-service',
  path: 'functions/package.json',
}).then(({ data }) => {
  console.log('Fetched repo')
  console.log(data)
}).catch((err) => {
  console.log('errrrrr')
  console.log(err)
})







interface SendNewsletter {
  fileName: string
}

const validator: Validator<SendNewsletter> = ({ fileName }) =>
  isString(fileName) 
    ? { fileName }
    : null
  

export default createRoute(validator, ({ fileName }) => {
  console.log('> Reading: ' + fileName)
  const file = readFileSync(`../email-html/${fileName}`, 'utf8')

  return sendNewsletter(file, 'Newsletter')
    .then(intoHandlerResult)
})

