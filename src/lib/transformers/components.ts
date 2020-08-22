import { types } from '@babel/core'
import { MigrationHelper } from '../MigrationHelper'

export function addComponents(
  migrationHelper: MigrationHelper,
  property: types.ObjectProperty
): void {
  const declaration = migrationHelper.exportDefaultDeclaration
    .declaration as types.ObjectExpression

  declaration.properties.splice(0, 0, property)
}
