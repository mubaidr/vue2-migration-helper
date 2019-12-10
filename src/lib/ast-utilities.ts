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

export function addSetupMethod(ast: types.File) {
  for (let i = 0; i < ast.program.body.length; i += 1) {
    const statement = ast.program.body[i]

    if (types.isExportDefaultDeclaration(statement)) {
      ast.program.body[i] = types.exportDefaultDeclaration(
        types.objectExpression([
          types.objectMethod(
            'method',
            types.identifier('setup'),
            [],
            types.blockStatement([])
          )
        ])
      )

      break
    }
  }
}

export function getExportDefault(ast: types.File) {
  const statement = ast.program.body.find(s => {
    return types.isExportDefaultDeclaration(s)
  }) as types.ExportDefaultDeclaration

  return statement
}
