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

export function getExportDefault(ast: types.File) {
  const statement = ast.program.body.find(s => {
    return types.isExportDefaultDeclaration(s)
  }) as types.ExportDefaultDeclaration

  return statement
}

export function getSetupMethod(ast: types.File) {
  const statement = ast.program.body.find(s => {
    return types.isExportDefaultDeclaration(s)
  }) as types.ExportDefaultDeclaration

  const declaration = statement.declaration as types.ObjectExpression
  const properties = declaration.properties as types.ObjectMethod[]
  const setups = properties.filter(prop => {
    if (types.isObjectMethod(prop) || types.isObjectProperty(prop)) {
      const key = prop.key as types.Identifier

      if (key.name === 'setup') {
        return true
      }
    }

    return false
  })

  return setups[0]
}

export function getSetupReturnStatement(ast: types.File) {
  const setupMethod = getSetupMethod(ast)
  const returnStatement = setupMethod.body.body.find(s =>
    types.isReturnStatement(s)
  )

  if (types.isReturnStatement(returnStatement)) {
    return {
      returnStatement,
      arguments: returnStatement.argument
    }
  }

  return {
    returnStatement: undefined,
    arguments: undefined
  }
}

export function getDataReturnStatement(ast: types.File) {
  const exportDefault = getExportDefault(ast)
  const declaration = exportDefault.declaration as types.ObjectExpression
  const properties = declaration.properties

  for (let i = 0; i < properties.length; i += 1) {
    const property = properties[i]

    if (types.isObjectMethod(property) && property.key.name === 'data') {
      const returnStatement = property.body.body.find(s =>
        types.isReturnStatement(s)
      )

      if (types.isReturnStatement(returnStatement)) {
        return {
          returnStatement,
          arguments: returnStatement.argument
        }
      }
    }
  }

  return {
    returnStatement: undefined,
    arguments: undefined
  }
}
