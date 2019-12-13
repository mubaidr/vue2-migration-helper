import { types } from '@babel/core'
import { getSetupMethod } from '../../astUtilities'

export function addHooks(ast: types.File, section: types.ObjectMethod) {
  const setupMethodBody = getSetupMethod(ast).body.body
  // const hookProps = section.body.body as types.ObjectExpression

  // console.log(hookProps)
}
