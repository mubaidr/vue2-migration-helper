import { types } from '@babel/core'
import { getAst, getCode } from '../astUtilities'

export function updateThisCalls(
  ast: types.File,
  list: string[],
  preString = '',
  postString = '',
  preAppendString = '',
  postAppendString = ''
) {
  let code = getCode(ast)

  list.forEach(item => {
    const regExp = new RegExp(
      `(${preString + item + postString})[;|(|)|{|}|[|\]|\s]`,
      'gmi'
    )

    code = code.replace(regExp, match => {
      return match.replace(
        preString + item + postString,
        preAppendString + item + postAppendString
      )
    })
  })

  return getAst(code)
}
