import { types } from '@babel/core'
import {
  addSetupMethod,
  getAst,
  getCode,
  getExportDefault
} from './lib/ast-utilities'
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
  const outputAst = types.cloneDeep(originalAst)
  const exportDefualt = getExportDefault(originalAst)

  // add & return setup method
  addSetupMethod(outputAst)

  // add vue3 imports
  addImports(outputAst, exportDefualt)

  // convert data to reactive properties

  // update component body
  console.log('TCL: code \r\n', getCode(outputAst))
}

// testing code
vue2MigrationHelper({
  path: './__tests__/data/text.vue'
})
