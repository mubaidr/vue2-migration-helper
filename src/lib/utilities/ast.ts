import { types } from '@babel/core'
import generator from '@babel/generator'
import { parse } from '@babel/parser'

export function getAst(source: string): types.File {
  const ast = parse(source, {
    sourceType: 'module',
    plugins: ['typescript'],
    tokens: true,
  })

  return ast
}

export function getCode(ast: types.File): string {
  return generator(ast, {}).code
}

export function getExportDefaultDeclaration(
  ast: types.File
): types.ExportDefaultDeclaration {
  const statement = ast.program.body.find((s) => {
    return types.isExportDefaultDeclaration(s)
  }) as types.ExportDefaultDeclaration

  return statement
}
