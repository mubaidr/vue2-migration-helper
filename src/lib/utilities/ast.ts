import { types } from '@babel/core'
import generator from '@babel/generator'
import { parse } from '@babel/parser'

export function getAst(source: string) {
  const ast = parse(source, {
    sourceType: 'module',
    plugins: ['typescript'],
    tokens: true
  })

  return ast
}

export function getCode(ast: types.File) {
  return generator(ast, {}).code
}

export function getExportDefaultDeclaration(ast: types.File) {
  const statement = ast.program.body.find(s => {
    return types.isExportDefaultDeclaration(s)
  }) as types.ExportDefaultDeclaration

  return statement
}
