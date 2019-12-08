import generator from '@babel/generator'
import { parse } from '@babel/parser'
import { Node } from '@babel/types'

export function getAst(source: string) {
  const ast = parse(source, {
    sourceType: 'module',
    plugins: ['typescript']
  })

  return ast
}

export function getCode(ast: Node) {
  return generator(ast, {}).code
}

export default {
  getAst
}
