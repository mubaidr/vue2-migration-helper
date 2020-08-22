import { vue2MigrationHelper } from '../../src/'

describe('vue2-migration-helper', () => {
  test('should be defined', () => {
    expect(vue2MigrationHelper).toBeDefined()
    expect(vue2MigrationHelper).toBeInstanceOf(Function)
  })

  test('should be able to extract js ast from vue sfc', () => {
    expect(() =>
      vue2MigrationHelper({
        source: './__tests__/data/collection/one.vue',
        target: './__tests__/data/collection/one-target.vue',
      })
    ).not.toThrow()
  })

  test('should be able to extract js ast from vue sfc', () => {
    expect(() =>
      vue2MigrationHelper({
        source: './__tests__/data/collection/two.vue',
        target: './__tests__/data/collection/two-target.vue',
      })
    ).not.toThrow()
  })

  test('should be able to extract js ast from vue sfc', () => {
    expect(() =>
      vue2MigrationHelper({
        source: './__tests__/data/collection/three.vue',
        target: './__tests__/data/collection/three-target.vue',
      })
    ).not.toThrow()
  })
})

describe('Try and convert all vue sfc in data/collection', () => {
  test('Should convert without failing', () => {
    vue2MigrationHelper({
      source: './__tests__/data/collection',
      target: './__tests__/data/collection-converted',
    })

    // const sourceGlob = path
    //   .resolve('../data/collection', '**/*.vue')
    //   .replace('\\', '/')

    // process each .vue file in source direcotry
    // glob(sourceGlob, (err, sources) => {
    //   if (err) console.error(chalk.red(err))

    //   sources.forEach((source) => {
    //     processFile(source, targetPath, path.basename(source))
    //   })
    // })
  })
})
