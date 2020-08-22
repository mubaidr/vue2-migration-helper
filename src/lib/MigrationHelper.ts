import { types } from '@babel/core'
import { SFCDescriptor } from 'vue-template-compiler'
import { addComponents } from './transformers/components'
import { addComputed } from './transformers/computed'
import { addData } from './transformers/data'
import { addHooks } from './transformers/hooks'
import { addMethods } from './transformers/methods'
import { addProps } from './transformers/props'
import { updateTemplateRefs } from './transformers/templateRefs'
import { updateThisReferences } from './transformers/thisReferences'
import { addWatch } from './transformers/watch'
import { getAst, getCode, getExportDefaultDeclaration } from './utilities/ast'
import { prepareimportSpecifiers } from './utilities/imports'
import { readTemplate, updateTemplate } from './utilities/template'
import { vue2Hooks } from './vue2'

export class MigrationHelper {
  readonly component: SFCDescriptor
  readonly ast: types.File
  readonly astOriginal: types.File
  readonly setupMethod: types.ObjectMethod
  readonly returnStatement: types.ReturnStatement
  readonly exportDefaultDeclaration: types.ExportDefaultDeclaration
  readonly exportDefaultDeclarationOriginal: types.ExportDefaultDeclaration

  dataIdentifiers: string[] = []
  computedIdentifiers: string[] = []
  methodIdentifiers: string[] = []
  propsIdentifiers: string[] = []

  constructor(source: string) {
    this.component = readTemplate(source)
    this.ast = getAst(this.component.script?.content || '')
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
    this.updateBody()

    // fix this references
    updateTemplateRefs(this)
    updateThisReferences(this)
  }

  getCode(): string {
    return updateTemplate(this.component, getCode(this.ast))
  }

  private addImports() {
    const importStatement = types.importDeclaration(
      prepareimportSpecifiers(this.exportDefaultDeclarationOriginal),
      types.stringLiteral('vue')
    )

    this.ast.program.body.unshift(importStatement)
  }

  private addSetupMethod() {
    const declaration = types.objectExpression([this.setupMethod])
    this.exportDefaultDeclaration.declaration = declaration
  }

  private updateBody() {
    let properties: (
      | types.ObjectMethod
      | types.ObjectProperty
      | types.SpreadElement
    )[] = []
    const declaration = this.exportDefaultDeclarationOriginal.declaration as
      | types.ObjectExpression
      | types.CallExpression

    if (!declaration) return

    if (types.isCallExpression(declaration)) {
      if (types.isObjectExpression(declaration.arguments[0])) {
        properties = declaration.arguments[0].properties
      }
    } else if (declaration.properties) {
      properties = declaration.properties
    }

    for (let i = 0; i < properties.length; i += 1) {
      const property = properties[i]

      if (types.isObjectMethod(property)) {
        const key = property.key as types.Identifier

        // hooks
        if (vue2Hooks.includes(key.name)) {
          addHooks(this, property)
        }

        // reactive data
        if (key.name === 'data') {
          this.dataIdentifiers = addData(this, property)
        }
      } else if (types.isObjectProperty(property)) {
        const key = property.key as types.Identifier

        switch (key.name) {
          case 'components':
            addComponents(this, property)
            break
          case 'props':
            this.propsIdentifiers = addProps(this, property)
            break
          case 'methods':
            this.methodIdentifiers = addMethods(this, property)
            break
          case 'computed':
            this.computedIdentifiers = addComputed(this, property)
            break
          case 'watch':
            addWatch(this, property)
            break
        }
      }

      // not required
      // if (property.type === 'SpreadElement') {}
    }
  }
}
