import { types } from '@babel/core'
import { getSetupMethod } from '../../astUtilities'

export function addData(ast: types.File, section: types.ObjectMethod) {
  const dataReturnStatement = section.body.body[0] as types.ReturnStatement
  const argument = dataReturnStatement.argument as types.ObjectExpression
  const setupMethodBody = getSetupMethod(ast).body.body
  const dataPropsList: string[] = []

  const reactiveStatement = types.variableDeclaration('const', [
    types.variableDeclarator(
      types.identifier('data'),
      types.callExpression(types.identifier('reactive'), [argument])
    )
  ])

  const returnStatement = types.returnStatement(
    types.objectExpression([
      types.spreadElement(
        types.callExpression(types.identifier('ref'), [
          types.identifier('data')
        ])
      )
    ])
  )

  setupMethodBody.push(reactiveStatement)
  setupMethodBody.push(returnStatement)

  // collect identifiers
  const properties = argument.properties

  for (let i = 0; i < properties.length; i += 1) {
    const property = properties[i]

    if (types.isObjectProperty(property)) {
      const key = property.key as types.Identifier
      dataPropsList.push(key.name)
    }
  }

  return dataPropsList
}
