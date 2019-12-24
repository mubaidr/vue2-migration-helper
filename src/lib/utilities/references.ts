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
  const setupMethodBody = migrationHelper.setupMethod.body.body
  const returnStatementBody = migrationHelper.returnStatement
    .argument as types.ObjectExpression

  traverse(migrationHelper.ast, {
    MemberExpression(nodePath) {
      const node = nodePath.node
      const object = node.object

      console.log(list)

      console.log(object)
    }
  })
}
