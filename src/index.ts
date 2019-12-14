import { types } from '@babel/core'
import { getAst, getCode } from './lib/astUtilities'
import { addBody } from './lib/generators/body'
import { addImports } from './lib/generators/imports'
import { addSetupMethod } from './lib/generators/setupMethod'
import { getOutputTemplate, getTemplate } from './lib/templateUtilities'
import { updateTemplateRefs } from './lib/transformers/templateRefs'
import { updateVueObjectReferences } from './lib/transformers/vueObjectReferences'

export function vue2MigrationHelper(options: { path: string }) {
  const originalTemplate = getTemplate(options.path)
  const originalAst = getAst(originalTemplate.script)
  let outputAst = types.cloneDeep(originalAst)

  // add vue3 imports
  addImports(outputAst)

  // add & return setup method
  addSetupMethod(outputAst)

  // add body
  outputAst = addBody(outputAst)

  // update template refs
  outputAst = updateTemplateRefs(outputAst)

  // update vue object this references
  outputAst = updateVueObjectReferences(outputAst)

  // return final code
  return getOutputTemplate(originalTemplate, getCode(outputAst))
}
