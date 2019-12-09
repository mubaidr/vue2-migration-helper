import { types } from '@babel/core'
import { getAst, getCode } from './lib/ast-utilities'
import { addImports } from './lib/generators/imports'
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
  const originalTemplate = await getTemplate(options.path)
  const originalAst = getAst(originalTemplate.script)
  const outputAst = types.clone(originalAst)

  // extract export declaration
  const exportIndex = originalAst.program.body.findIndex(node => {
    return node.type === 'ExportDefaultDeclaration'
  })
  const exportDefaultDeclaration = originalAst.program.body.splice(exportIndex)

  console.log(exportDefaultDeclaration)

  // add vue3 imports
  addImports(outputAst)

  // update component body
  console.log('TCL: code \r\n', getCode(outputAst))
}

// testing code
vue2MigrationHelper({
  path: './__tests__/data/text.vue'
})
