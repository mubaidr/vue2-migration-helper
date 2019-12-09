import { types } from '@babel/core'

export function addSetupMethod(ast: types.File) {
  for (let i = 0; i < ast.program.body.length; i += 1) {
    const statement = ast.program.body[i]

    if (statement.type === 'ExportDefaultDeclaration') {
      ast.program.body[i] = types.exportDefaultDeclaration(
        types.objectExpression([
          types.objectMethod(
            'method',
            types.identifier('setup'),
            [],
            types.blockStatement([])
          )
        ])
      )

      break
    }
  }
}
