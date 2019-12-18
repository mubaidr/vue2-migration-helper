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
import { updateThisCalls } from './lib/transformers/thisCalls'
import { vue2Hooks, vue2HooksDeprecated } from './lib/vue2'
import chalk = require('chalk')

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
    this.updateBody()
  }

  getCode() {
    console.log(chalk.cyan(getCode(this.ast)))
    return getOutputTemplate(this.template, getCode(this.ast))
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
          this.addHooks(property)
          continue
        }

        if (key.name === 'data') {
          // reactive properties
          dataPropsList = this.addData(property)
          continue
        }

        continue
      }

      if (types.isObjectProperty(property)) {
        const key = property.key as types.Identifier

        switch (key.name) {
          case 'components':
            this.addComponents(property)
            break
          case 'props':
            this.addProps(property)
            break
          case 'methods':
            methodsList = this.addMethods(property)
            break
          case 'computed':
            computedPropsList = this.addComputed(property)
            break
          case 'watch':
            this.addWatch(property)
            break
        }

        continue
      }

      // not required
      // if (property.type === 'SpreadElement') {}
    }

    this.ast = updateThisCalls(this.ast, dataPropsList, 'this.', '', 'data.')
    this.ast = updateThisCalls(this.ast, computedPropsList, 'this.')
    this.ast = updateThisCalls(this.ast, methodsList, 'this.')
  }

  addProps(property: types.ObjectProperty) {
    const declaration = this.exportDefaultDeclaration
      .declaration as types.ObjectExpression

    declaration.properties.splice(0, 0, property)
  }

  addComponents(property: types.ObjectProperty) {
    const declaration = this.exportDefaultDeclaration
      .declaration as types.ObjectExpression

    declaration.properties.splice(0, 0, property)
  }

  addMethods(section: types.ObjectProperty) {
    const setupMethodBody = this.setupMethod.body.body
    const MethodsProps = section.value as types.ObjectExpression
    const properties = MethodsProps.properties
    const methodsList = []

    for (let i = 0; i < properties.length; i += 1) {
      const property = properties[i]

      if (types.isObjectMethod(property)) {
        const key = property.key as types.Identifier

        const MethodsStatement = types.functionDeclaration(
          types.identifier(key.name),
          property.params,
          property.body,
          undefined,
          property.async
        )

        methodsList.push(key.name)
        setupMethodBody.splice(-1, 0, MethodsStatement)

        continue
      }

      if (types.isObjectProperty(property)) {
        const key = property.key as types.Identifier
        const value = property.value

        if (types.isArrowFunctionExpression(value)) {
          const body = value.body as types.BlockStatement

          const MethodsStatement = types.functionDeclaration(
            types.identifier(key.name),
            value.params,
            body,
            undefined,
            value.async
          )

          methodsList.push(key.name)
          setupMethodBody.splice(-1, 0, MethodsStatement)
        }

        if (types.isFunctionExpression(value)) {
          const MethodsStatement = types.functionDeclaration(
            types.identifier(key.name),
            value.params,
            value.body,
            undefined,
            value.async
          )

          methodsList.push(key.name)
          setupMethodBody.splice(-1, 0, MethodsStatement)
        }
      }

      if (types.isSpreadElement(property)) {
        const argument = property.argument as types.ArrayExpression
        const values = argument.elements as types.FunctionExpression[]

        values.forEach(value => {
          const key = value.id as types.Identifier

          const MethodsStatement = types.functionDeclaration(
            types.identifier(key.name),
            value.params,
            value.body,
            undefined,
            value.async
          )

          methodsList.push(key.name)
          setupMethodBody.splice(-1, 0, MethodsStatement)
        })
      }
    }

    // export computed properties
    const returnArguments = this.returnStatement
      .argument as types.ObjectExpression

    methodsList.forEach(exportItem => {
      returnArguments.properties.push(
        types.objectProperty(
          types.identifier(exportItem),
          types.identifier(exportItem),
          undefined,
          true
        )
      )
    })

    return methodsList
  }

  addData(section: types.ObjectMethod) {
    const setupMethodBody = this.setupMethod.body.body
    const dataReturnStatement = section.body.body[0] as types.ReturnStatement
    const argument = dataReturnStatement.argument as types.ObjectExpression
    const dataPropsList: string[] = []

    const reactiveStatement = types.variableDeclaration('const', [
      types.variableDeclarator(
        types.identifier('data'),
        types.callExpression(types.identifier('reactive'), [argument])
      )
    ])
    setupMethodBody.unshift(reactiveStatement)

    const returnArguments = this.returnStatement
      .argument as types.ObjectExpression

    returnArguments.properties.unshift(
      types.spreadElement(
        types.callExpression(types.identifier('ref'), [
          types.identifier('data')
        ])
      )
    )

    // collect identifiers
    const properties = argument.properties
    for (let i = 0; i < properties.length; i += 1) {
      const property = properties[i]

      if (types.isObjectProperty(property)) {
        const key = property.key as types.Identifier
        dataPropsList.push(key.name)
      }
    }

    return dataPropsList
  }

  addComputed(section: types.ObjectProperty) {
    const setupMethodBody = this.setupMethod.body.body
    const computedProps = section.value as types.ObjectExpression
    const properties = computedProps.properties
    const computedPropsList = []

    for (let i = 0; i < properties.length; i += 1) {
      const property = properties[i]

      if (types.isObjectMethod(property)) {
        const key = property.key as types.Identifier

        const computedStatement = types.variableDeclaration('const', [
          types.variableDeclarator(
            types.identifier(key.name),
            types.callExpression(types.identifier('computed'), [
              types.arrowFunctionExpression([], property.body)
            ])
          )
        ])

        computedPropsList.push(key.name)
        setupMethodBody.splice(-1, 0, computedStatement)

        continue
      }

      if (types.isObjectProperty(property)) {
        const key = property.key as types.Identifier
        const value = property.value

        if (types.isArrowFunctionExpression(value)) {
          const computedStatement = types.variableDeclaration('const', [
            types.variableDeclarator(
              types.identifier(key.name),
              types.callExpression(types.identifier('computed'), [value])
            )
          ])

          computedPropsList.push(key.name)
          setupMethodBody.splice(-1, 0, computedStatement)
        }

        if (types.isFunctionExpression(value)) {
          const computedStatement = types.variableDeclaration('const', [
            types.variableDeclarator(
              types.identifier(key.name),
              types.callExpression(types.identifier('computed'), [
                types.arrowFunctionExpression([], value.body)
              ])
            )
          ])

          computedPropsList.push(key.name)
          setupMethodBody.splice(-1, 0, computedStatement)
        }
      }

      // if (types.isSpreadElement(property)) {}
    }

    // export computed properties
    const returnArguments = this.returnStatement
      .argument as types.ObjectExpression

    computedPropsList.forEach(exportItem => {
      returnArguments.properties.push(
        types.objectProperty(
          types.identifier(exportItem),
          types.identifier(exportItem),
          undefined,
          true
        )
      )
    })

    return computedPropsList
  }

  addHooks(section: types.ObjectMethod) {
    const setupMethodBody = this.setupMethod.body.body
    const key = section.key as types.Identifier

    if (vue2Hooks.includes(key.name)) {
      let name = key.name
      name = 'on' + name[0].toUpperCase() + name.substr(1)

      setupMethodBody.splice(
        -1,
        0,
        types.expressionStatement(
          types.callExpression(types.identifier(name), [
            types.arrowFunctionExpression(section.params, section.body)
          ])
        )
      )
    }

    if (vue2HooksDeprecated.includes(key.name)) {
      setupMethodBody.splice(-1, 0, ...section.body.body)
    }
  }

  addWatch(section: types.ObjectProperty) {
    const setupMethodBody = this.setupMethod.body.body
    const WatchesProps = section.value as types.ObjectExpression
    const properties = WatchesProps.properties

    for (let i = 0; i < properties.length; i += 1) {
      const property = properties[i]

      if (types.isObjectMethod(property)) {
        const key = property.key as types.Identifier

        const WatchesStatement = types.expressionStatement(
          types.callExpression(types.identifier('watch'), [
            types.identifier(key.name),
            types.arrowFunctionExpression(property.params, property.body)
          ])
        )

        setupMethodBody.splice(1, 0, WatchesStatement)

        continue
      }

      if (types.isObjectProperty(property)) {
        const key = property.key as types.Identifier
        const value = property.value

        if (types.isArrowFunctionExpression(value)) {
          const WatchesStatement = types.expressionStatement(
            types.callExpression(types.identifier('watch'), [
              types.identifier(key.name),
              value
            ])
          )

          setupMethodBody.splice(1, 0, WatchesStatement)
        }

        if (types.isFunctionExpression(value)) {
          const WatchesStatement = types.expressionStatement(
            types.callExpression(types.identifier('watch'), [
              types.identifier(key.name),
              types.arrowFunctionExpression(value.params, value.body)
            ])
          )

          setupMethodBody.splice(1, 0, WatchesStatement)
        }
      }

      if (types.isSpreadElement(property)) {
        const argument = property.argument as types.ArrayExpression
        const values = argument.elements as types.FunctionExpression[]

        values.forEach(value => {
          const key = value.id as types.Identifier

          const WatchesStatement = types.variableDeclaration('const', [
            types.variableDeclarator(
              types.identifier(key.name),
              types.arrowFunctionExpression(
                value.params,
                value.body,
                value.async
              )
            )
          ])

          setupMethodBody.splice(-1, 0, WatchesStatement)
        })
      }
    }
  }
}
