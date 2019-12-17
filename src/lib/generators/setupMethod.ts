import { types } from '@babel/core'
import { getExportDefault } from '../astUtilities'

export function addSetupMethod(ast: types.File) {
  let exportDefault = getExportDefault(ast)

  exportDefault = types.exportDefaultDeclaration(
    types.objectExpression([
      types.objectMethod(
        'method',
        types.identifier('setup'),
        [types.identifier('props'), types.identifier('context')],
        types.blockStatement([
          types.returnStatement(types.objectExpression([]))
        ])
      )
    ])
  )
}
