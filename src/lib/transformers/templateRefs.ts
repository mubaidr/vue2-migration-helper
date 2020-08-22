import { traverse, types } from '@babel/core'
import { MigrationHelper } from '../MigrationHelper'

export function updateTemplateRefs(migrationHelper: MigrationHelper): void {
  const setupMethodBody = migrationHelper.setupMethod.body.body
  const returnStatementBody = migrationHelper.returnStatement
    .argument as types.ObjectExpression
  const templateRefSet: Set<string> = new Set()

  traverse(migrationHelper.ast, {
    MemberExpression(nodePath) {
      const node = nodePath.node
      const object = node.object

      if (!types.isMemberExpression(object)) return

      const objectExpression = object.object

      if (!types.isThisExpression(objectExpression)) return

      const objectProperty = object.property as types.Identifier

      if (objectProperty.name !== '$refs') return

      const property = node.property as types.Identifier
      const name = property.name

      templateRefSet.add(name)

      if (!types.isMemberExpression(nodePath.parentPath.node)) return
      if (!types.isMemberExpression(nodePath.parentPath.node.object)) return

      nodePath.parentPath.node.object = nodePath.parentPath.node.object.property
    },
  })

  // add to return statement
  templateRefSet.forEach((templateRef) => {
    returnStatementBody.properties.push(
      types.objectProperty(
        types.identifier(templateRef),
        types.identifier(templateRef),
        undefined,
        true
      )
    )

    // add declaration
    setupMethodBody.splice(
      1,
      0,
      types.variableDeclaration('const', [
        types.variableDeclarator(
          types.identifier(templateRef),
          types.callExpression(types.identifier('ref'), [
            types.identifier('null'),
          ])
        ),
      ])
    )
  })
}
