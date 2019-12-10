import { types } from '@babel/core'

export function addData(ast: types.File, property: types.ObjectMethod) {
  const returnStatement = property.body.body[0] as types.ReturnStatement
  const argument = returnStatement.argument as types.ObjectExpression
  const properties = argument.properties

  for (let i = 0; i < properties.length; i += 1) {
    const property = properties[i] as types.ObjectProperty
    const key = property.key as types.Identifier

    console.log(key)
  }
}
