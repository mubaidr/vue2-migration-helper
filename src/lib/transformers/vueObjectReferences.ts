import { types } from '@babel/core'
import { getAst, getCode } from '../astUtilities'

export function updateVueObjectReferences(ast: types.File) {
  let code = getCode(ast)

  const regExp = new RegExp(`(this[.])([$].*)`, 'gmi')

  // update vue object this references
  code = code.replace(regExp, (match, a) => {
    return match.replace(a, 'context.').replace('$', '')
  })

  return getAst(code)
}
