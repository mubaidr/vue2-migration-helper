import { types } from '@babel/core'
import { getAst, getCode, getExportDefault } from './lib/ast-utilities'
import { addBody } from './lib/generators/body'
import { addImports } from './lib/generators/imports'
import { addSetupMethod } from './lib/generators/setupMethod'
import { getTemplate } from './lib/template-utilities'

export async function vue2MigrationHelper(options: {
  path: string
}): Promise<void> {
  const originalTemplate = await getTemplate(options.path)
  const originalAst = getAst(originalTemplate.script)
  const outputAst = types.cloneDeep(originalAst)
  const exportDefault = getExportDefault(originalAst)

  // add vue3 imports
  addImports(outputAst, exportDefault)

  // add & return setup method
  addSetupMethod(outputAst)

  // add body
  addBody(outputAst, exportDefault)

  // update component body
  console.log('\r\n\r\nTCL: code \r\n\r\n', getCode(outputAst))
}

// testing code
vue2MigrationHelper({
  path: './__tests__/data/text.vue'
})
