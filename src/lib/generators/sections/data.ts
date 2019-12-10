import { types } from '@babel/core'

export function addData(ast: types.File, section: types.ObjectMethod) {
  const returnStatement = section.body.body[0] as types.ReturnStatement
  const argument = returnStatement.argument as types.ObjectExpression
  const properties = argument.properties as types.ObjectProperty[]

  for (let i = 0; i < properties.length; i += 1) {
    const property = properties[i]
    const key = property.key as types.Identifier

    console.log(key.name)
  }
}
