import { types } from '@babel/core'
import { getReturnStatement, getSetupMethod } from '../../astUtilities'

export function addComputed(ast: types.File, section: types.ObjectProperty) {
  const setupMethodBody = getSetupMethod(ast).body.body
  const computedProps = section.value as types.ObjectExpression
  const properties = computedProps.properties
  const computedPropsList = []

  for (let i = 0; i < properties.length; i += 1) {
    const property = properties[i]

    if (types.isObjectMethod(property)) {
      const key = property.key as types.Identifier

      const computedStatement = types.variableDeclaration('const', [
        types.variableDeclarator(
          types.identifier(key.name),
          types.callExpression(types.identifier('computed'), [
            types.arrowFunctionExpression([], property.body)
          ])
        )
      ])

      computedPropsList.push(key.name)
      setupMethodBody.splice(1, 0, computedStatement)

      continue
    }

    if (types.isObjectProperty(property)) {
      const key = property.key as types.Identifier
      const value = property.value

      if (types.isArrowFunctionExpression(value)) {
        const computedStatement = types.variableDeclaration('const', [
          types.variableDeclarator(
            types.identifier(key.name),
            types.callExpression(types.identifier('computed'), [value])
          )
        ])

        computedPropsList.push(key.name)
        setupMethodBody.splice(1, 0, computedStatement)
      }

      if (types.isFunctionExpression(value)) {
        const computedStatement = types.variableDeclaration('const', [
          types.variableDeclarator(
            types.identifier(key.name),
            types.callExpression(types.identifier('computed'), [
              types.arrowFunctionExpression([], value.body)
            ])
          )
        ])

        computedPropsList.push(key.name)
        setupMethodBody.splice(1, 0, computedStatement)
      }
    }

    // if (types.isSpreadElement(property)) {}
  }

  // export computed properties
  const { argument } = getReturnStatement(setupMethodBody)

  computedPropsList.forEach(exportItem => {
    argument.properties.push(
      types.objectProperty(
        types.identifier(exportItem),
        types.identifier(exportItem),
        undefined,
        true
      )
    )
  })

  return computedPropsList
}
