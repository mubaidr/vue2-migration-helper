import { types } from '@babel/core'
import { prepareimportSpecifiers } from './generators/imports'
import { addComponents } from './transformers/components'
import { addComputed } from './transformers/computed'
import { addData } from './transformers/data'
import { addHooks } from './transformers/hooks'
import { addMethods } from './transformers/methods'
import { addProps } from './transformers/props'
import { addWatch } from './transformers/watch'
import { getAst, getCode, getExportDefaultDeclaration } from './utilities/ast'
import { replaceReferences } from './utilities/references'
import {
  ContentTemplate,
  readTemplate,
  updateTemplate
} from './utilities/template'
import { vue2Hooks, vue2HooksDeprecated } from './vue2'

export class MigrationHelper {
  template: ContentTemplate
  templateOriginal: ContentTemplate
  ast: types.File
  astOriginal: types.File
  setupMethod: types.ObjectMethod
  returnStatement: types.ReturnStatement
  exportDefaultDeclaration: types.ExportDefaultDeclaration
  exportDefaultDeclarationOriginal: types.ExportDefaultDeclaration

  constructor(source: string) {
    this.template = readTemplate(source)
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
    this.updateBody()
  }

  getCode() {
    console.log(getCode(this.ast))
    return updateTemplate(this.template, getCode(this.ast))
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

  private updateBody() {
    const declaration = this.exportDefaultDeclarationOriginal
      .declaration as types.ObjectExpression
    const properties = declaration.properties

    let dataPropsList: string[] = []
    let methodsList: string[] = []
    let computedPropsList: string[] = []

    for (let i = 0; i < properties.length; i += 1) {
      const property = properties[i]

      if (types.isObjectMethod(property)) {
        const key = property.key as types.Identifier

        if (
          vue2Hooks.includes(key.name) ||
          vue2HooksDeprecated.includes(key.name)
        ) {
          // hooks
          addHooks(this, property)
          continue
        }

        if (key.name === 'data') {
          // reactive properties
          dataPropsList = addData(this, property)
          continue
        }

        continue
      }

      if (types.isObjectProperty(property)) {
        const key = property.key as types.Identifier

        switch (key.name) {
          case 'components':
            addComponents(this, property)
            break
          case 'props':
            addProps(this, property)
            break
          case 'methods':
            methodsList = addMethods(this, property)
            break
          case 'computed':
            computedPropsList = addComputed(this, property)
            break
          case 'watch':
            addWatch(this, property)
            break
        }

        continue
      }

      // not required
      // if (property.type === 'SpreadElement') {}
    }

    // TODO: replacing ast breaks setupMethod, returnStatement references
    // update ast instad of replace
    this.ast = replaceReferences(this.ast, dataPropsList, 'this.', '', 'data.')
    this.ast = replaceReferences(this.ast, computedPropsList, 'this.')
    this.ast = replaceReferences(this.ast, methodsList, 'this.')
  }
}
