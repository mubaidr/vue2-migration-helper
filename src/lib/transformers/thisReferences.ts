import { traverse, types } from '@babel/core'
import { MigrationHelper } from '../MigrationHelper'

//replace all this references
export function updateThisReferences(migrationHelper: MigrationHelper): void {
  const {
    propsIdentifiers,
    dataIdentifiers,
    computedIdentifiers,
    methodIdentifiers,
  } = migrationHelper

  traverse(migrationHelper.ast, {
    ThisExpression(nodePath) {
      const parentNode = nodePath.parentPath.node

      if (!types.isMemberExpression(parentNode)) return

      const parentProperty = parentNode.property as types.Identifier
      const identifierName = parentProperty.name

      // props
      if (propsIdentifiers.includes(identifierName)) {
        nodePath.parentPath.replaceWith(
          types.memberExpression(types.identifier('props'), parentProperty)
        )

        return
      }

      // data
      if (dataIdentifiers.includes(identifierName)) {
        nodePath.parentPath.replaceWith(
          types.memberExpression(types.identifier('data'), parentProperty)
        )

        return
      }

      // computed and methods
      if (
        computedIdentifiers.includes(identifierName) ||
        methodIdentifiers.includes(identifierName)
      ) {
        nodePath.parentPath.replaceWith(parentProperty)

        return
      }

      // all other vue references
      nodePath.parentPath.replaceWith(
        types.memberExpression(types.identifier('context'), parentProperty)
      )
    },
  })
}
