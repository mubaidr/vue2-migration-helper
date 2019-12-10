import { types } from '@babel/core'
import { getSetupMethod } from '../../ast-utilities'

export function addMethods(ast: types.File, section: types.ObjectProperty) {
  const setupMethodBody = getSetupMethod(ast).body.body
  const methodProps = section.value as types.ObjectExpression

  console.log(methodProps)
}
