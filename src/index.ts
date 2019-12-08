import { NodePath, types } from '@babel/core'
import traverse from '@babel/traverse'
import { getAst } from './lib/ast-utilities'
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
  // program and export default reference
  const outputAst = types.file(types.program([]), [], [])
  let exportDefaultDeclaration: NodePath<types.ExportDefaultDeclaration>

  // copy export node
  traverse(originalAst, {
    ExportDefaultDeclaration: path => {
      // exportDefaultDeclaration = JSON.parse(JSON.stringify(path))
    }
  })

  // add vue 3 imports
  addImports(outputAst)

  console.log(originalAst, outputAst)

  // update component body
  // console.log('TCL: code \r\n', getCode(originalAst))
}

// testing code
vue2MigrationHelper({
  path: './__tests__/data/text.vue'
})
