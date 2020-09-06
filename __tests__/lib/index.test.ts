import rimraf from 'rimraf'
import { vue2MigrationHelper } from '../../src/'

beforeEach(() => {
  rimraf.sync('./__tests__/data/collection-converted')
})

afterAll(() => {
  rimraf.sync('./__tests__/data/collection-converted')
})

describe('vue2-migration-helper', () => {
  test('should be defined', () => {
    expect(vue2MigrationHelper).toBeDefined()
    expect(vue2MigrationHelper).toBeInstanceOf(Function)
  })

  test('should be able to extract js ast from vue sfc', () => {
    expect(() =>
      vue2MigrationHelper({
        source: './__tests__/data/one.vue',
        target: './__tests__/data/collection-converted',
      })
    ).not.toThrow()
  })

  test('should be able to extract js ast from vue sfc', () => {
    expect(() =>
      vue2MigrationHelper({
        source: './__tests__/data/two.vue',
        target: './__tests__/data/collection-converted',
      })
    ).not.toThrow()
  })

  test('should be able to extract js ast from vue sfc', () => {
    expect(() =>
      vue2MigrationHelper({
        source: './__tests__/data/three.vue',
        target: './__tests__/data/collection-converted',
      })
    ).not.toThrow()
  })
})

describe('Try and convert all vue sfc in data/collection', () => {
  test('Should convert without failing', () => {
    expect(() => {
      vue2MigrationHelper({
        source: './__tests__/data',
        target: './__tests__/data/collection-converted',
      })
    }).not.toThrow()
  })
})
