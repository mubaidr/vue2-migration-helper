import { MigrationHelper } from '../MigrationHelper'

export function replaceReferences(
  migrationHelper: MigrationHelper,
  list: string[],
  preString = '',
  postString = '',
  preAppendString = '',
  postAppendString = ''
) {
  console.log(list, preString, postString, preAppendString, postAppendString)

  // traverse(migrationHelper.ast, {
  //   MemberExpression(nodePath) {
  //     const node = nodePath.node
  //     const object = node.object

  //     if (!types.isThisExpression(object)) return

  //     const property = node.property as types.Identifier

  //     // if (!list.includes(property.name)) return

  //     console.log(property.name)
  //   }
  // })
}
