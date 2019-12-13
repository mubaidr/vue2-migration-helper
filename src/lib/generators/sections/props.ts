import { types } from '@babel/core'
import { getExportDefault } from '../../ast-utilities'

export function addProps(ast: types.File, property: types.ObjectProperty) {
  const exportDefault = getExportDefault(ast)
  const declaration = exportDefault.declaration as types.ObjectExpression

  declaration.properties.splice(0, 0, property)
}
