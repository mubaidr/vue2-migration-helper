import chalk from 'chalk'
import fs from 'fs'
import glob from 'glob'
import path from 'path'
import { MigrationHelper } from './lib/MigrationHelper'

type Options = {
  source: string
  target?: string
}

function processFile(source: string, targetRoot: string) {
  const migrationHelper = new MigrationHelper(source)
  const fileName = source.split('/').pop() as string

  console.log(chalk.yellow(`Processing: ${source}`))

  // get final code
  const code = migrationHelper.getCode()
  const targetPath = path.resolve(targetRoot, fileName)

  // write file
  if (
    process.env.NODE_ENV !== 'development' &&
    process.env.NODE_ENV !== 'test'
  ) {
    fs.writeFileSync(targetPath, code)
  }

  console.log(chalk.green(`Processed: ${targetPath}`))
}

export function vue2MigrationHelper({ source, target }: Options) {
  // check if source directory exists
  if (!fs.existsSync(source)) {
    throw new Error(`Invalid source path: ${source}`)
  }

  // check if target directory exists
  if (target && path.dirname(target) === target) {
    throw new Error(`Target must be a directory: ${target}`)
  }

  // check if source is single file or directory
  if (fs.lstatSync(source).isFile()) {
    processFile(source, path.dirname(target || source))
  } else {
    const targetRoot = target || source
    const sourceGlob = path.resolve(source, '**/*.vue').replace('\\', '/')

    // process each .vue file in source direcotry
    glob(sourceGlob, (err, sources) => {
      if (err) console.error(chalk.red(err))

      sources.forEach(source => {
        processFile(source, targetRoot)
      })
    })
  }
}

export default {
  vue2MigrationHelper
}

vue2MigrationHelper({
  source: '__tests__/data/',
  target: './tmp/'
})
