import { types } from '@babel/core'
import { getAst, getCode } from '../ast-utilities'

export function updateTemplateRefs(ast: types.File) {
  let code = getCode(ast)

  // const regExp = new RegExp(`(this.$refs.)[;|(|)|{|}|[|\]|\s]`, 'gmi')

  // code = code.replace(regExp, match => {
  //   console.log(match)
  //   return match.replace('this.$refs.', '')
  // })

  return getAst(code)
}
