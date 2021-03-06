import { types } from '@babel/core'
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

export function prepareimportSpecifiers(
  exportDefaultDeclaration: types.ExportDefaultDeclaration | undefined
): types.ImportSpecifier[] {
  const importSpecifiers: types.ImportSpecifier[] = []

  if (!exportDefaultDeclaration) return importSpecifiers

  const declaration = exportDefaultDeclaration.declaration as
    | types.ObjectExpression
    | types.CallExpression

  if (!declaration) return importSpecifiers

  const properties: (
    | types.SpreadElement
    | types.ObjectMethod
    | types.ObjectProperty
  )[] = []

  if (types.isCallExpression(declaration)) {
    const node = declaration.arguments[0]
    if (types.isObjectExpression(node)) {
      properties.concat(node.properties)
    }
  } else if (declaration.properties) {
    properties.concat(declaration.properties)
  }

  properties.forEach((property) => {
    if (types.isObjectMethod(property) || types.isObjectProperty(property)) {
      const name = property.key?.name
      const importKeyword = getImportForKey(name)
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
      ),
    ]
  )

  return importSpecifiers
}
