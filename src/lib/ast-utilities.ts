import { parse } from '@babel/parser'
import { print } from 'recast'
import { Node } from '@babel/types'

export function getAst(source: string) {
  const ast = parse(source, {
    sourceType: 'module',
    plugins: [
      'typescript',
      'dynamicImport',
      'objectRestSpread',
      'logicalAssignment',
      'estree'
    ]
  })

  return ast
}

export function getCode(ast: Node) {
  return print(ast, {
    tabWidth: 2,
    quote: 'single',
    arrayBracketSpacing: true,
    objectCurlySpacing: true
  }).code
}

export default {
  getAst
}
