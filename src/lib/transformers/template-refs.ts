import { types } from '@babel/core'
import traverse from '@babel/traverse'
import { getSetupMethod } from '../ast-utilities'

export function updateTemplateRefs(ast: types.File) {
  const setupMethodBody = getSetupMethod(ast).body.body

  traverse(ast, {
    enter(nodePath) {
      const node = nodePath.node

      // if(path.node)
      // console.log(node)
    },
    AssignmentExpression(nodePath) {
      const node = nodePath.node

      console.log(node.left)
    }
    // MemberExpression(nodePath) {
    //   const property = nodePath.node.property as types.Identifier
    //   const object = nodePath.node.object as types.Node

    //   if (!property.name.includes('$refs')) return

    //   console.log(property.name, object)

    //   // nodePath.node = types.identifier(name.substr(0, 10))
    // }
  })
}
