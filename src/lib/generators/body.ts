import { types } from '@babel/core'

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

export function addBody(
  ast: types.File,
  exportDefaultDeclaration: types.ExportDefaultDeclaration
) {
  const declaration = exportDefaultDeclaration.declaration

  if (declaration.type !== 'ObjectExpression') {
    throw new Error('Unidentified declaration...')
  }

  const properties = declaration.properties

  for (let i = 0; i < properties.length; i += 1) {
    const property = properties[i]
    let key: types.Identifier

    if (property.type === 'ObjectMethod') {
      key = property.key

      if (vue2Hooks.includes(key.name)) {
        // hooks

        continue
      }

      if (key.name === 'data') {
        // reactive properties

        continue
      }

      continue
    }

    if (property.type === 'ObjectProperty') {
      key = property.key

      switch (key.name) {
        case 'methods':
          break
        case 'computed':
          break
        case 'watch':
        default:
          break
      }

      continue
    }

    // not required
    // if (property.type === 'SpreadElement') {}
  }
}
