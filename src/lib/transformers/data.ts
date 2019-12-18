import { types } from '@babel/core'
import { MigrationHelper } from '../MigrationHelper'
import { replaceReferences } from '../utilities/references'

export function addData(
  migrationHelper: MigrationHelper,
  section: types.ObjectMethod
) {
  const setupMethodBody = migrationHelper.setupMethod.body.body
  const dataReturnStatement = section.body.body[0] as types.ReturnStatement
  const argument = dataReturnStatement.argument as types.ObjectExpression
  const dataPropsList: string[] = []

  const reactiveStatement = types.variableDeclaration('const', [
    types.variableDeclarator(
      types.identifier('data'),
      types.callExpression(types.identifier('reactive'), [argument])
    )
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
  const properties = argument.properties
  for (let i = 0; i < properties.length; i += 1) {
    const property = properties[i]

    if (types.isObjectProperty(property)) {
      const key = property.key as types.Identifier
      dataPropsList.push(key.name)
    }
  }

  // replace references
  replaceReferences(migrationHelper, dataPropsList, 'this.', '', 'data.')
}
