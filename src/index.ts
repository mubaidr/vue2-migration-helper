import { namedTypes, visit } from 'ast-types'
import { getAst } from './lib/ast-utilities'
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
  // const sections: string[] = []

  visit(ast, {
    visitProgram: path => {
      // path.node.body.unshift(getImportsNode())
    },
    visitExportDefaultDeclaration: path => {
      const declaration = path.node.declaration

      if (declaration.type === 'ObjectExpression') {
        const properties = declaration.properties

        properties.forEach(property => {
          if (namedTypes.SpreadProperty.check(property)) {
            console.log('SpreadProperty')
          }

          if (namedTypes.ObjectMethod.check(property)) {
            console.log('ObjectMethod')
          }

          if (namedTypes.ObjectProperty.check(property)) {
            console.log('ObjectProperty')
          }
        })
      }
    }
  })

  // console.log('TCL: code \r\n', getCode(ast))
}

// testing code
vue2MigrationHelper({
  path: './__tests__/data/text.vue'
})
