import { types } from '@babel/core'
import { MigrationHelper } from '../MigrationHelper'

export function addMethods(
  migrationHelper: MigrationHelper,
  section: types.ObjectProperty
): string[] {
  const setupMethodBody = migrationHelper.setupMethod.body.body
  const MethodsProps = section.value as types.ObjectExpression
  const properties = MethodsProps.properties
  const methodIdentifiers: string[] = []

  for (let i = 0; i < properties.length; i += 1) {
    const property = properties[i]

    if (types.isObjectMethod(property)) {
      const key = property.key as types.Identifier

      const MethodsStatement = types.functionDeclaration(
        types.identifier(key.name),
        property.params,
        property.body,
        undefined,
        property.async
      )

      methodIdentifiers.push(key.name)
      setupMethodBody.splice(-1, 0, MethodsStatement)

      continue
    }

    if (types.isObjectProperty(property)) {
      const key = property.key as types.Identifier
      const value = property.value

      if (types.isArrowFunctionExpression(value)) {
        const body = value.body as types.BlockStatement

        const MethodsStatement = types.functionDeclaration(
          types.identifier(key.name),
          value.params,
          body,
          undefined,
          value.async
        )

        methodIdentifiers.push(key.name)
        setupMethodBody.splice(-1, 0, MethodsStatement)
      }

      if (types.isFunctionExpression(value)) {
        const MethodsStatement = types.functionDeclaration(
          types.identifier(key.name),
          value.params,
          value.body,
          undefined,
          value.async
        )

        methodIdentifiers.push(key.name)
        setupMethodBody.splice(-1, 0, MethodsStatement)
      }
    }

    if (types.isSpreadElement(property)) {
      const argument = property.argument as types.ArrayExpression
      const values = argument.elements as types.FunctionExpression[]

      values.forEach((value) => {
        const key = value.id as types.Identifier

        const MethodsStatement = types.functionDeclaration(
          types.identifier(key.name),
          value.params,
          value.body,
          undefined,
          value.async
        )

        methodIdentifiers.push(key.name)
        setupMethodBody.splice(-1, 0, MethodsStatement)
      })
    }
  }

  // export computed properties
  const returnArguments = migrationHelper.returnStatement
    .argument as types.ObjectExpression

  methodIdentifiers.forEach((exportItem) => {
    returnArguments.properties.push(
      types.objectProperty(
        types.identifier(exportItem),
        types.identifier(exportItem),
        undefined,
        true
      )
    )
  })

  // replace references
  return methodIdentifiers
}
