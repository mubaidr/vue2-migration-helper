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

export function getDataReturnStatement(ast: types.File) {
  const exportDefault = getExportDefaultDeclaration(ast)
  const declaration = exportDefault.declaration as types.ObjectExpression
  const properties = declaration.properties

  for (let i = 0; i < properties.length; i += 1) {
    const property = properties[i]

    if (types.isObjectMethod(property) && property.key.name === 'data') {
      const returnStatement = property.body.body.find(s =>
        types.isReturnStatement(s)
      ) as types.ReturnStatement

      return {
        returnStatement,
        returnArguments: returnStatement.argument
      }
    }
  }

  return {
    returnStatement: undefined,
    returnArguments: undefined
  }
}

enum enumPositions {
  'start' = 'start',
  'end' = 'end'
}

export function addToSetupMethod(
  setupMethod: types.ObjectMethod,
  statement: types.Statement,
  position: enumPositions = enumPositions.start
) {
  setupMethod.body.body.splice(
    position === enumPositions.start ? 1 : -1,
    0,
    statement
  )
}

export function addToReturnStatement(
  setupMethod: types.ObjectMethod,
  statement: types.Statement,
  position: enumPositions = enumPositions.start
) {
  setupMethod.body.body.splice(
    position === enumPositions.start ? 1 : -1,
    0,
    statement
  )
}
