import { types } from '@babel/core'
import { getSetupMethod } from '../../ast-utilities'

export function addComputed(ast: types.File, section: types.ObjectProperty) {
  const setupMethodBody = getSetupMethod(ast).body.body
  const computedProps = section.value as types.ObjectExpression

  console.log(computedProps)
}
