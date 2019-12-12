import { types } from '@babel/core'
import { getAst, getCode } from '../ast-utilities'

export function updateTemplateRefs(ast: types.File) {
  const code = getCode(ast)

  // search using regExp
  // keep backreference
  // add backreference to setup body

  // const regExp = new RegExp(preString + item + postString, 'gi')
  // code = code.replace(regExp, preAppendString + item + postAppendString)

  return getAst(code)
}
