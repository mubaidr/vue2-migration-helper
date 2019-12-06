import { types } from '@babel/core'

export function getImportsNode() {
  return types.importDeclaration(
    [
      types.importSpecifier(types.identifier('ref'), types.identifier('ref')),
      types.importSpecifier(
        types.identifier('watch'),
        types.identifier('watch')
      ),
      types.importSpecifier(
        types.identifier('computed'),
        types.identifier('computed')
      ),
      types.importSpecifier(
        types.identifier('onMounted'),
        types.identifier('onMounted')
      )
    ],
    types.stringLiteral('vue')
  )
}

export default {
  getImportsNode
}
