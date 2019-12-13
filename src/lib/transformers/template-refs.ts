import { types } from '@babel/core'
import { getAst, getCode, getSetupMethod } from '../ast-utilities'

export function updateTemplateRefs(ast: types.File) {
  let code = getCode(ast)
  const templateRefList: string[] = []

  const regExp = new RegExp(`(this[.][$]refs[.])(.*)[.]`, 'gmi')

  // replace this.$refs
  // extract tempalte Refs identifiers
  code = code.replace(regExp, (match, a, b) => {
    if (!templateRefList.includes(b)) {
      templateRefList.push(b)
    }

    return match.replace('this.$refs.', '').replace(b, b + '.value')
  })

  ast = getAst(code)

  // addd ref(null) for each template ref
  const setupMethod = getSetupMethod(ast)
  templateRefList.forEach(templateRef => {
    const templateRefStatement = types.variableDeclaration('const', [
      types.variableDeclarator(
        types.identifier(templateRef),
        types.callExpression(types.identifier('ref'), [types.nullLiteral()])
      )
    ])

    setupMethod.body.body.splice(1, 0, templateRefStatement)
  })

  return ast
}
