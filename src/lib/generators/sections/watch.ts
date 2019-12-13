import { types } from '@babel/core'
import { getSetupMethod } from '../../astUtilities'

export function addWatches(ast: types.File, section: types.ObjectProperty) {
  const setupMethodBody = getSetupMethod(ast).body.body
  const WatchesProps = section.value as types.ObjectExpression
  const properties = WatchesProps.properties

  for (let i = 0; i < properties.length; i += 1) {
    const property = properties[i]

    if (types.isObjectMethod(property)) {
      const key = property.key as types.Identifier

      const WatchesStatement = types.expressionStatement(
        types.callExpression(types.identifier('watch'), [
          types.identifier(key.name),
          types.arrowFunctionExpression(property.params, property.body)
        ])
      )

      setupMethodBody.splice(1, 0, WatchesStatement)

      continue
    }

    if (types.isObjectProperty(property)) {
      const key = property.key as types.Identifier
      const value = property.value

      if (types.isArrowFunctionExpression(value)) {
        const WatchesStatement = types.expressionStatement(
          types.callExpression(types.identifier('watch'), [
            types.identifier(key.name),
            value
          ])
        )

        setupMethodBody.splice(1, 0, WatchesStatement)
      }

      if (types.isFunctionExpression(value)) {
        const WatchesStatement = types.expressionStatement(
          types.callExpression(types.identifier('watch'), [
            types.identifier(key.name),
            types.arrowFunctionExpression(value.params, value.body)
          ])
        )

        setupMethodBody.splice(1, 0, WatchesStatement)
      }
    }

    if (types.isSpreadElement(property)) {
      const argument = property.argument as types.ArrayExpression
      const values = argument.elements as types.FunctionExpression[]

      values.forEach(value => {
        const key = value.id as types.Identifier

        const WatchesStatement = types.variableDeclaration('const', [
          types.variableDeclarator(
            types.identifier(key.name),
            types.arrowFunctionExpression(value.params, value.body, value.async)
          )
        ])

        setupMethodBody.splice(-1, 0, WatchesStatement)
      })
    }
  }
}
