import { types } from '@babel/core'
import { getSetupMethod } from '../../astUtilities'
import { vue2Hooks, vue2HooksDeprecated } from '../../vue2'

export function addHooks(ast: types.File, section: types.ObjectMethod) {
  const setupMethodBody = getSetupMethod(ast).body.body
  const key = section.key as types.Identifier

  if (vue2Hooks.includes(key.name)) {
    let name = key.name
    name = 'on' + name[0].toUpperCase() + name.substr(1)

    setupMethodBody.splice(
      -1,
      0,
      types.expressionStatement(
        types.callExpression(types.identifier(name), [
          types.arrowFunctionExpression(section.params, section.body)
        ])
      )
    )
  }

  if (vue2HooksDeprecated.includes(key.name)) {
    setupMethodBody.splice(-1, 0, ...section.body.body)
  }
}
