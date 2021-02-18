const showdown = require('showdown')
const mjml2Html = require('mjml')
const fs = require('fs')

const TEMPLATE_FILE = './template-src/index.mjml'

const converter = new showdown.Converter();

const markdownText = fs.readFileSync('./content/january.md', 'utf8');

const converted = converter.makeHtml(markdownText)

const template = fs.readFileSync(TEMPLATE_FILE, 'utf8')

const mjmlString = template.replace('{{ content }}', converted)

console.log(mjml2Html(mjmlString).html)

