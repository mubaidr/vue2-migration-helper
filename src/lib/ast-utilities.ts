import { types } from '@babel/core'
import generator from '@babel/generator'
import { parse } from '@babel/parser'

export function getAst(source: string) {
  const ast = parse(source, {
    sourceType: 'module',
    plugins: ['typescript']
  })

  return ast
}

export function getCode(ast: types.File) {
  return generator(ast, {}).code
}

export function extractExportDefaultDeclaration(
  ast: types.File
): types.ExportDefaultDeclaration {
  const exportIndex = ast.program.body.findIndex(node => {
    return node.type === 'ExportDefaultDeclaration'
  })

  const statement = ast.program.body.splice(exportIndex)[0]

  if (statement.type === 'ExportDefaultDeclaration') {
    return statement
  } else {
    return types.exportDefaultDeclaration(types.objectExpression([]))
  }
}

export default {
  getAst,
  getCode
}
