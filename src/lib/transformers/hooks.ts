import { types } from '@babel/core'
import { MigrationHelper } from '../MigrationHelper'
import { toVue3HookName, vue2Hooks, vue2HooksDeprecated } from '../vue2'

export function addHooks(
  migrationHelper: MigrationHelper,
  section: types.ObjectMethod
) {
  const setupMethodBody = migrationHelper.setupMethod.body.body
  const key = section.key as types.Identifier

  if (vue2HooksDeprecated.includes(key.name)) {
    setupMethodBody.splice(
      -1,
      0,
      types.expressionStatement(
        types.callExpression(
          types.arrowFunctionExpression([], section.body),
          []
        )
      )
    )
  } else if (vue2Hooks.includes(key.name)) {
    const name = toVue3HookName(key.name)

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
}
