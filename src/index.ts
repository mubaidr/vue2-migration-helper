import { types } from '@babel/core'
import { getAst, getCode, getExportDefault } from './lib/astUtilities'
import { addBody } from './lib/generators/body'
import { addImports } from './lib/generators/imports'
import { addSetupMethod } from './lib/generators/setupMethod'
import { getTemplate } from './lib/templateUtilities'
import { updateTemplateRefs } from './lib/transformers/templateRefs'
import { updateVueObjectReferences } from './lib/transformers/vueObjectReferences'

export async function vue2MigrationHelper(options: {
  path: string
}): Promise<string> {
  const originalTemplate = await getTemplate(options.path)
  const originalAst = getAst(originalTemplate.script)
  let outputAst = types.cloneDeep(originalAst)
  const exportDefault = getExportDefault(originalAst)

  // add vue3 imports
  addImports(outputAst, exportDefault)

  // add & return setup method
  addSetupMethod(outputAst)

  // add body
  outputAst = addBody(outputAst, exportDefault)

  // update template refs
  outputAst = updateTemplateRefs(outputAst)

  // update vue object this references
  outputAst = updateVueObjectReferences(outputAst)

  // return final code
  return getCode(outputAst)
}

// testing code
vue2MigrationHelper({
  path: './__tests__/data/text.vue'
}).then(res => {
  console.log(res)
})
