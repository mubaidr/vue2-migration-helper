import { types } from '@babel/core'

function getImportForKey(name: string) {
  const vueImports = ['watch', 'computed']
  const vue2Hooks = [
    // 'beforeCreate',
    // 'created',
    'beforeMount',
    'mounted',
    'beforeUpdated',
    'updated',
    'beforeDestroy',
    'destroyed'
  ]

  if (vueImports.includes(name)) {
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
  const { declaration } = exportDefaultDeclaration

  if (declaration.type === 'ObjectExpression') {
    declaration.properties.forEach(property => {
      if (
        property.type === 'ObjectMethod' ||
        property.type === 'ObjectProperty'
      ) {
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
  }

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

export function addImports(
  ast: types.File,
  exportDefaultDeclaration: types.ExportDefaultDeclaration
) {
  const importStatements = types.importDeclaration(
    prepareimportSpecifiers(exportDefaultDeclaration),
    types.stringLiteral('vue')
  )

  ast.program.body.unshift(importStatements)
}
