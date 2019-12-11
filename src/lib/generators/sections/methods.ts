import { types } from '@babel/core'
import { getSetupMethod } from '../../ast-utilities'

export function addMethods(ast: types.File, section: types.ObjectProperty) {
  const setupMethodBody = getSetupMethod(ast).body.body
  const MethodsProps = section.value as types.ObjectExpression
  const properties = MethodsProps.properties

  for (let i = 0; i < properties.length; i += 1) {
    const property = properties[i]

    if (types.isObjectMethod(property)) {
      const key = property.key as types.Identifier

      const MethodsStatement = types.variableDeclaration('const', [
        types.variableDeclarator(
          types.identifier(key.name),
          types.callExpression(types.identifier('watch'), [
            types.arrowFunctionExpression(property.params, property.body)
          ])
        )
      ])

      setupMethodBody.splice(-1, 0, MethodsStatement)

      continue
    }

    if (types.isObjectProperty(property)) {
      const key = property.key as types.Identifier
      const value = property.value

      if (types.isArrowFunctionExpression(value)) {
        const MethodsStatement = types.variableDeclaration('const', [
          types.variableDeclarator(
            types.identifier(key.name),
            types.callExpression(types.identifier('watch'), [value])
          )
        ])

        setupMethodBody.splice(-1, 0, MethodsStatement)
      }

      if (types.isFunctionExpression(value)) {
        const MethodsStatement = types.variableDeclaration('const', [
          types.variableDeclarator(
            types.identifier(key.name),
            types.callExpression(types.identifier('watch'), [
              types.arrowFunctionExpression(value.params, value.body)
            ])
          )
        ])

        setupMethodBody.splice(-1, 0, MethodsStatement)
      }
    }

    // if (types.isSpreadElement(property)) {}
  }
}
