import { types } from '@babel/core'
import chalk from 'chalk'
import fs from 'fs'
import mkdirp from 'mkdirp'
import { getAst, getCode } from './lib/astUtilities'
import { addBody } from './lib/generators/body'
import { addImports } from './lib/generators/imports'
import { addSetupMethod } from './lib/generators/setupMethod'
import { getOutputTemplate, getTemplate } from './lib/templateUtilities'
import { updateTemplateRefs } from './lib/transformers/templateRefs'
import { updateVueObjectReferences } from './lib/transformers/vueObjectReferences'

type Options = {
  source: string
  target?: string
  dryRun?: boolean
}

export function vue2MigrationHelper({
  source,
  target = '',
  dryRun = false
}: Options) {
  const originalTemplate = getTemplate(source)
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

  // get final code
  const code = getOutputTemplate(originalTemplate, getCode(outputAst))

  // write file
  if (!dryRun && target) {
    mkdirp(target, (err: unknown) => {
      console.error(chalk.red(err))

      fs.writeFileSync(target, code)
    })
  }

  // return final code
  return code
}

export default {
  vue2MigrationHelper
}

console.log(
  vue2MigrationHelper({
    source: '__tests__/data/text.vue',
    target: './tmp/'
  })
)
