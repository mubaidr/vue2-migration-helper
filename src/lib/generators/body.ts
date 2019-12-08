import { NodePath, types } from '@babel/core'

export function addBody(path: NodePath) {
  // clone
  const declaration: types.ObjectExpression = JSON.parse(
    JSON.stringify(path.node.declaration)
  )

  path.node.declaration = types.objectExpression([])

  if (!types.isObjectExpression(declaration)) return

  const properties = declaration.properties

  properties.forEach(property => {
    let key: types.Identifier

    switch (property.type) {
      case 'ObjectMethod':
        key = property.key
        sections.push(key.name)
        console.log(key.name)
        break
      case 'ObjectProperty':
        key = property.key
        sections.push(key.name)
        console.log(key.name)
        break
      case 'SpreadElement':
        if (property.argument.type === 'ArrayExpression') {
          property.argument.elements.forEach(element => {
            if (types.isFunctionExpression(element)) {
              console.log(element.id?.name)
            }
          })
        }
        break
    }
  })
}
