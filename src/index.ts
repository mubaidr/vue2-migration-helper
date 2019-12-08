import traverse from '@babel/traverse'
import { Identifier } from '@babel/types'
import { getAst } from './lib/ast-utilities'
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
  // const sections: string[] = []

  traverse(ast, {
    Program: path => {
      path.node.body.unshift(getImportsNode())
    },
    ExportDefaultDeclaration: path => {
      const declaration = path.node.declaration

      if (declaration.type === 'ObjectExpression') {
        const properties = declaration.properties

        properties.forEach(property => {
          let key: Identifier

          switch (property.type) {
            case 'ObjectMethod':
              key = property.key
              console.log(key.name)
              break
            case 'ObjectProperty':
              key = property.key
              console.log(key.name)
              break
            case 'SpreadElement':
              if (property.argument.type === 'ArrayExpression') {
                console.log(property.argument.elements.length)
              }
              break
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
