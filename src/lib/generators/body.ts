import { types } from '@babel/core'
import { vue2Hooks } from '../vue2'
import { addComputed } from './sections/computed'
import { addData } from './sections/data'
import { addHooks } from './sections/hooks'
import { addMethods } from './sections/methods'
import { addWatches } from './sections/watch'

export function addBody(
  ast: types.File,
  exportDefaultDeclaration: types.ExportDefaultDeclaration
) {
  const declaration = exportDefaultDeclaration.declaration as types.ObjectExpression
  const properties = declaration.properties

  for (let i = 0; i < properties.length; i += 1) {
    const property = properties[i]

    if (types.isObjectMethod(property)) {
      const key = property.key as types.Identifier

      if (vue2Hooks.includes(key.name)) {
        // hooks
        addHooks(ast, property)
        continue
      }

      if (key.name === 'data') {
        // reactive properties
        addData(ast, property)
        continue
      }

      continue
    }

    if (types.isObjectProperty(property)) {
      const key = property.key as types.Identifier

      switch (key.name) {
        case 'methods':
          addMethods(ast, property)
          break
        case 'computed':
          addComputed(ast, property)
          break
        case 'watch':
          addWatches(ast, property)
          break
      }

      continue
    }

    // not required
    // if (property.type === 'SpreadElement') {}
  }
}
