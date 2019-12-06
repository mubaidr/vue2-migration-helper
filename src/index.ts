import traverse, { Node, NodePath } from '@babel/traverse'
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
  // const sections: string[] = []

  traverse(ast, {
    Program: path => {
      path.node.body.unshift(getImportsNode())
    },
    ExportDefaultDeclaration: path => {
      const declaration: Node = path.node.declaration

      // console.log(declaration)

      Object.entries(declaration).forEach(entry => {
        const key: string = entry[0]
        const value: NodePath[] = entry[1]

        if (key === 'properties') {
          // value.forEach((v: Node) => {
          //   // console.log(v.key)
          // })
          console.log('TCL: value', value[0].key)
        }
      })
    }
  })

  console.log('TCL: code \r\n', getCode(ast))
}

// testing code
vue2MigrationHelper({
  path: './__tests__/data/text.vue'
})
