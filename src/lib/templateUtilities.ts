import fs from 'fs'
import xml2js from 'xml2js'

export async function getTemplate(path: string) {
  const source = fs.readFileSync(path, 'utf-8')
  const template: {
    root: {
      template: string[]
      style: string[]
      script: string[]
    }
  } = await xml2js.parseStringPromise(`<root>${source}</root>`)

  return {
    template: template.root.template.join(''),
    script: template.root.script.join(''),
    style: template.root.style.join('')
  }
}
