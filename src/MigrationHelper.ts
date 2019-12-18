import { types } from '@babel/core'
import {
  getAst,
  getCode,
  getExportDefaultDeclaration
} from './lib/astUtilities'
import { prepareimportSpecifiers } from './lib/generators/imports'
import {
  ContentTemplate,
  getOutputTemplate,
  getTemplate
} from './lib/templateUtilities'

export class MigrationHelper {
  private template: ContentTemplate
  private templateOriginal: ContentTemplate
  private ast: types.File
  private astOriginal: types.File
  private setupMethod: types.ObjectMethod
  private returnStatement: types.ReturnStatement
  private exportDefaultDeclaration: types.ExportDefaultDeclaration
  private exportDefaultDeclarationOriginal: types.ExportDefaultDeclaration

  constructor(source: string) {
    this.template = getTemplate(source)
    this.templateOriginal = JSON.parse(JSON.stringify(this.template))
    this.ast = getAst(this.template.script)
    this.astOriginal = types.cloneDeep(this.ast)
    this.exportDefaultDeclaration = getExportDefaultDeclaration(this.ast)
    this.exportDefaultDeclarationOriginal = getExportDefaultDeclaration(
      this.astOriginal
    )
    this.returnStatement = types.returnStatement(types.objectExpression([]))
    this.setupMethod = types.objectMethod(
      'method',
      types.identifier('setup'),
      [types.identifier('props'), types.identifier('context')],
      types.blockStatement([this.returnStatement])
    )

    this.addImports()
    this.addSetupMethod()
  }

  private addImports() {
    const importStatement = types.importDeclaration(
      prepareimportSpecifiers(this.exportDefaultDeclarationOriginal),
      types.stringLiteral('vue')
    )

    this.ast.program.body.unshift(importStatement)
  }

  private addSetupMethod() {
    const declaration = this.exportDefaultDeclaration
      ?.declaration as types.ObjectExpression

    declaration.properties = [this.setupMethod]
  }

  getCode() {
    return getOutputTemplate(this.template, getCode(this.ast))
  }
}
