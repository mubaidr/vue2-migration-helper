import { traverse, types } from '@babel/core'
import { MigrationHelper } from '../MigrationHelper'

export enum ReferenceType {
  'data' = 'data',
  'computed' = 'computed',
  'methods' = 'methods'
}

export function replaceReferences(
  migrationHelper: MigrationHelper,
  list: string[],
  type: ReferenceType
) {
  // debug code
  if (type == ReferenceType.computed) return

  const setupMethodBody = migrationHelper.setupMethod.body.body
  const returnStatementBody = migrationHelper.returnStatement
    .argument as types.ObjectExpression

  traverse(migrationHelper.ast, {
    // MemberExpression(nodePath) {
    //   const node = nodePath.node
    //   const object = node.object

    //   if (!types.isMemberExpression(object)) return

    //   // const objectProperty = object.property as types.Identifier

    //   // if (!list.includes(objectProperty.name)) return

    //   console.log(object)
    // }

    ThisExpression(nodePath) {
      const node = nodePath.node
      // const object = node.object

      if (!types.isMemberExpression(node)) return
      if (!types.isMemberExpression(nodePath.parent)) return

      // finish this
      console.log(node.property)
      nodePath.parent.object = node.object
    }
  })
}
