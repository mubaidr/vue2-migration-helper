import parser, { j2xParser } from 'fast-xml-parser'
import fs from 'fs'

export type ContentTemplate = {
  template: string
  script: string
  style: string
}

export function readTemplate(path: string) {
  if (!fs.existsSync(path)) {
    throw new Error(`Input file does not exists: ${path}`)
  }

  const source = fs.readFileSync(path, 'utf-8')
  const content = parser.parse(source) as ContentTemplate

  return content
}

export function updateTemplate(
  contentTemplate: ContentTemplate,
  code: string
): string {
  contentTemplate.script = code
  const parser = new j2xParser({
    format: true,
    indentBy: '  '
  })

  return parser.parse(contentTemplate)
}
