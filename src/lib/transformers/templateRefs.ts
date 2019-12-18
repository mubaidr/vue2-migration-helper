import { types } from '@babel/core'
import { getAst, getCode } from '../astUtilities'

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
  const setupMethodBody = getSetupMethod(ast).body.body
  const returnStatement = setupMethodBody.slice(-1)[0] as types.ReturnStatement

  const argument = returnStatement.argument as types.ObjectExpression

  templateRefList.forEach(templateRef => {
    const templateRefStatement = types.variableDeclaration('const', [
      types.variableDeclarator(
        types.identifier(templateRef),
        types.callExpression(types.identifier('ref'), [types.nullLiteral()])
      )
    ])

    // declare template ref
    // return template ref from setup body
    setupMethodBody.splice(1, 0, templateRefStatement)
    argument.properties.push(
      types.objectProperty(
        types.identifier(templateRef),
        types.identifier(templateRef),
        undefined,
        true
      )
    )
  })

  return ast
}
