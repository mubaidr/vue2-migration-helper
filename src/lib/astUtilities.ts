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
