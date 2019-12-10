import { types } from '@babel/core'
import { getSetupMethod } from '../../ast-utilities'

export function addWatches(ast: types.File, section: types.ObjectProperty) {
  const setupMethodBody = getSetupMethod(ast).body.body
  const watchProps = section.value as types.ObjectExpression

  console.log(watchProps)
}
