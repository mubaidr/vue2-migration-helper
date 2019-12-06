import babelParser from '@babel/parser'

export function getAst(source: string) {
  const ast = babelParser.parse(source, {
    sourceType: 'module',
    plugins: [
      'typescript',
      'dynamicImport',
      'objectRestSpread',
      'logicalAssignment',
      'estree'
    ]
  })

  return ast
}

export default {
  getAst
}
