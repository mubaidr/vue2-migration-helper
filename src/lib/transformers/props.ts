import { types } from '@babel/core'
import { MigrationHelper } from '../MigrationHelper'

export function addProps(
  migrationHelper: MigrationHelper,
  property: types.ObjectProperty
) {
  const declaration = migrationHelper.exportDefaultDeclaration
    .declaration as types.ObjectExpression
  const propsIdentifiers: string[] = []

  declaration.properties.splice(0, 0, property)

  if (types.isObjectExpression(property.value)) {
    const properties = property.value.properties as types.ObjectProperty[]

    propsIdentifiers.push(...properties.map(p => p.key.name))
  }

  if (types.isArrayExpression(property.value)) {
    const properties = property.value.elements as types.StringLiteral[]

    propsIdentifiers.push(...properties.map(p => p.value))
  }

  return propsIdentifiers
}
