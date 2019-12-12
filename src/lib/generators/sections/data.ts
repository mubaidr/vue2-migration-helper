import { types } from '@babel/core'
import { getSetupMethod } from '../../ast-utilities'

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

  // extract identifier names into dataPropsList from argument
  console.log(argument)

  return dataPropsList
}
