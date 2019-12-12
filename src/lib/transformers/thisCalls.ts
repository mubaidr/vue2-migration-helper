import { types } from '@babel/core'
import generate from '@babel/generator'
import { getAst } from '../ast-utilities'
// import { getSetupMethod } from '../ast-utilities'

export function updateThisCalls(
  ast: types.File,
  list: string[],
  preString = '',
  postString = '',
  preAppendString = '',
  postAppendString = ''
) {
  let code = generate(ast).code

  list.forEach(item => {
    console.log(preString + item + postString)

    const regExp = new RegExp(preString + item + postString, 'gi')
    code = code.replace(regExp, preAppendString + item + postAppendString)
  })

  ast = getAst(code)
}
