import { vue2MigrationHelper } from '../../src/'

describe('vue2-migration-helper', () => {
  test('should be defined', () => {
    expect(vue2MigrationHelper).toBeDefined()
    expect(vue2MigrationHelper).toBeInstanceOf(Function)
  })

  test('should be able to extract js ast from vue sfc', () => {
    expect(() =>
      vue2MigrationHelper({
        source: './__tests__/data/one.vue',
        target: './__tests__/data/one-target.vue',
      })
    ).not.toThrow()
  })

  test('should be able to extract js ast from vue sfc', () => {
    expect(() =>
      vue2MigrationHelper({
        source: './__tests__/data/two.vue',
        target: './__tests__/data/two-target.vue',
      })
    ).not.toThrow()
  })

  test('should be able to extract js ast from vue sfc', () => {
    expect(() =>
      vue2MigrationHelper({
        source: './__tests__/data/three.vue',
        target: './__tests__/data/three-target.vue',
      })
    ).not.toThrow()
  })
})
