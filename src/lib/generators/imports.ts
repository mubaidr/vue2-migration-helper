import { types } from '@babel/core'
import { getExportDefault } from '../astUtilities'
import { vue2Hooks, vue2Imports } from '../vue2'

function getImportForKey(name: string) {
  if (vue2Imports.includes(name)) {
    return name
  }

  if (vue2Hooks.includes(name)) {
    name = 'on' + name[0].toUpperCase() + name.substr(1)

    return name
  }

  return undefined
}

function prepareimportSpecifiers(
  exportDefaultDeclaration: types.ExportDefaultDeclaration
) {
  const importSpecifiers: types.ImportSpecifier[] = []
  const declaration = exportDefaultDeclaration.declaration as types.ObjectExpression

  declaration.properties.forEach(property => {
    if (types.isObjectMethod(property) || types.isObjectProperty(property)) {
      const importKeyword = getImportForKey(property.key.name)

      if (importKeyword) {
        const importSpecifier = types.importSpecifier(
          types.identifier(importKeyword),
          types.identifier(importKeyword)
        )

        importSpecifiers.push(importSpecifier)
      }
    }
  })

  // default imports
  importSpecifiers.unshift(
    ...[
      types.importSpecifier(types.identifier('ref'), types.identifier('ref')),
      types.importSpecifier(
        types.identifier('reacted'),
        types.identifier('reacted')
      ),
      types.importSpecifier(
        types.identifier('toRefs'),
        types.identifier('toRefs')
      )
    ]
  )

  return importSpecifiers
}

export function addImports(ast: types.File) {
  const exportDefault = getExportDefault(ast)
  const importStatements = types.importDeclaration(
    prepareimportSpecifiers(exportDefault),
    types.stringLiteral('vue')
  )

  ast.program.body.unshift(importStatements)
}
