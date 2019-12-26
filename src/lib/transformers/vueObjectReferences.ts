import { traverse, types } from '@babel/core'
import { MigrationHelper } from '../MigrationHelper'

//replace all this references
export function updateVueObjectReferences(migrationHelper: MigrationHelper) {
  traverse(migrationHelper.ast, {
    ThisExpression(nodePath) {
      const parentNode = nodePath.parentPath.node

      if (!types.isMemberExpression(parentNode)) return

      nodePath.parentPath.replaceWith(
        types.memberExpression(types.identifier('context'), parentNode.property)
      )
    }
  })
}
