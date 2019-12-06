import { types } from '@babel/core'
import traverse from '@babel/traverse'

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

  traverse(ast, {
    enter(path) {
      const { type } = path.node

      if (type === 'Program') {
        // insert vue 3 imports
        const importNode = types.importDeclaration(
          [
            types.importSpecifier(
              types.identifier('ref'),
              types.identifier('ref')
            )
            // types.importSpecifier('watch'),
            // types.importSpecifier('computed'),
            // types.importSpecifier('onMounted '),
          ],
          types.stringLiteral('vue')
        )

        // path.node.body.unshift(types.importNode(importNode))

        console.log(path.node)
      }
    }
  })
}
