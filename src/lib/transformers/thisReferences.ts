import { traverse } from '@babel/core'
import { MigrationHelper } from '../MigrationHelper'

//replace all this references
export function updateThisReferences(migrationHelper: MigrationHelper) {
  const {
    propsIdentifiers,
    dataIdentifiers,
    computedIdentifiers,
    methodIdentifiers
  } = migrationHelper

  traverse(migrationHelper.ast, {
    MemberExpression(nodePath) {
      console.log()
    }
  })
}
