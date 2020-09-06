import { types } from '@babel/core'
import { MigrationHelper } from '../MigrationHelper'

export function addData(
  migrationHelper: MigrationHelper,
  section: types.ObjectMethod
): string[] {
  const setupMethodBody = migrationHelper.setupMethod.body.body
  const dataReturnStatement = section.body.body[0] as types.ReturnStatement
  const argument = dataReturnStatement.argument as types.ObjectExpression
  const dataIdentifiers: string[] = []

  const reactiveStatement = types.variableDeclaration('const', [
    types.variableDeclarator(
      types.identifier('data'),
      types.callExpression(types.identifier('reactive'), [argument])
    ),
  ])
  setupMethodBody.unshift(reactiveStatement)

  const returnArguments = migrationHelper.returnStatement
    .argument as types.ObjectExpression

  returnArguments.properties.unshift(
    types.spreadElement(
      types.callExpression(types.identifier('ref'), [types.identifier('data')])
    )
  )

  // collect identifiers
  if (!argument.properties) return dataIdentifiers

  const properties = argument.properties
  for (let i = 0; i < properties.length; i += 1) {
    const property = properties[i]

    if (types.isObjectProperty(property)) {
      const key = property.key as types.Identifier
      dataIdentifiers.push(key.name)
    }
  }

  // replace references
  return dataIdentifiers
}
