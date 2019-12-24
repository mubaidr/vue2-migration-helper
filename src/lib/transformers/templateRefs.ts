import { traverse, types } from '@babel/core'
import { MigrationHelper } from '../MigrationHelper'

export function updateTemplateRefs(migrationHelper: MigrationHelper) {
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

      //TODO: replace expression with new expressions
      console.log(nodePath.node)
    }
  })

  templateRefSet.forEach(templateRef => {
    returnStatementBody.properties.push(
      types.objectProperty(
        types.identifier(templateRef),
        types.identifier(templateRef),
        undefined,
        true
      )
    )

    setupMethodBody.splice(
      1,
      0,
      types.variableDeclaration('const', [
        types.variableDeclarator(
          types.identifier(templateRef),
          types.callExpression(types.identifier('ref'), [
            types.identifier('null')
          ])
        )
      ])
    )
  })
}
