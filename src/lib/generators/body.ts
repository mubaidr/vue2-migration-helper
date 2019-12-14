import { types } from '@babel/core'
import { updateThisCalls } from '../transformers/thisCalls'
import { vue2Hooks, vue2HooksDeprecated } from '../vue2'
import { addComponents } from './sections/components'
import { addComputed } from './sections/computed'
import { addData } from './sections/data'
import { addHooks } from './sections/hooks'
import { addMethods } from './sections/methods'
import { addProps } from './sections/props'
import { addWatches } from './sections/watch'

export function addBody(
  ast: types.File,
  exportDefaultDeclaration: types.ExportDefaultDeclaration
) {
  const declaration = exportDefaultDeclaration.declaration as types.ObjectExpression
  const properties = declaration.properties

  let dataPropsList: string[] = []
  let methodsList: string[] = []
  let computedPropsList: string[] = []

  for (let i = 0; i < properties.length; i += 1) {
    const property = properties[i]

    if (types.isObjectMethod(property)) {
      const key = property.key as types.Identifier

      if (
        vue2Hooks.includes(key.name) ||
        vue2HooksDeprecated.includes(key.name)
      ) {
        // hooks
        addHooks(ast, property)
        continue
      }

      if (key.name === 'data') {
        // reactive properties
        dataPropsList = addData(ast, property)
        continue
      }

      continue
    }

    if (types.isObjectProperty(property)) {
      const key = property.key as types.Identifier

      switch (key.name) {
        case 'components':
          addComponents(ast, property)
          break
        case 'props':
          addProps(ast, property)
          break
        case 'methods':
          methodsList = addMethods(ast, property)
          break
        case 'computed':
          computedPropsList = addComputed(ast, property)
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

  ast = updateThisCalls(ast, dataPropsList, 'this.', '', 'data.')
  ast = updateThisCalls(ast, computedPropsList, 'this.')
  ast = updateThisCalls(ast, methodsList, 'this.')

  return ast
}
