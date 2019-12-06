import { vue2MigrationHelper } from '../../src/'

describe('vue2-migration-helper', () => {
  test('should be defined', () => {
    expect(vue2MigrationHelper).toBeDefined()
    expect(vue2MigrationHelper).toBeInstanceOf(Function)
  })

  test('should be able to extract js ast from vue sfc', () => {
    expect(
      vue2MigrationHelper({
        path: './__tests__/text.vue'
      })
    ).toBeDefined()
  })
})
