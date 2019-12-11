import { types } from '@babel/core'
import { getSetupMethod } from '../ast-utilities'

export function updateThisCalls(ast: types.File) {
  const setupMethodBody = getSetupMethod(ast).body.body
}
