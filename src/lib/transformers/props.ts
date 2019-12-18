import { types } from '@babel/core'
import { MigrationHelper } from '../MigrationHelper'

export function addProps(
  migrationHelper: MigrationHelper,
  property: types.ObjectProperty
) {
  const declaration = migrationHelper.exportDefaultDeclaration
    .declaration as types.ObjectExpression

  declaration.properties.splice(0, 0, property)
}
