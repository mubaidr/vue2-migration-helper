import traverse from '@babel/traverse'

import { getAst, getCode } from './lib/ast-utilities'
import { getImportsNode } from './lib/imports'
import { getTemplate } from './lib/template-utilities'

// TODO: add reactive properties definitions
// TODO: convert computed syntax
// TODO: convert watch syntax
// TODO: convert methods syntax
// TODO: convert life-cycle hooks
// TODO: convert props syntax
// TODO: update this.$event usage

export async function vue2MigrationHelper(options: {
  path: string
}): Promise<void> {
  const template = await getTemplate(options.path)
  const ast = getAst(template.script)

  traverse(ast, {
    Program: path => {
      path.node.body.unshift(getImportsNode())
    },
    ExportDefaultDeclaration: path => {
      console.log(path.node.declaration)
    }
  })

  console.log('TCL: code \r\n', getCode(ast))
}

// testing code
vue2MigrationHelper({
  path: './__tests__/data/text.vue'
})
