import { types } from '@babel/core'
import { getExportDefaultDeclaration } from '../../astUtilities'

export function addComponents(ast: types.File, property: types.ObjectProperty) {
  const exportDefault = getExportDefaultDeclaration(ast)
  const declaration = exportDefault.declaration as types.ObjectExpression

  declaration.properties.splice(0, 0, property)
}
