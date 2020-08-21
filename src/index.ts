import chalk from 'chalk'
import fs from 'fs'
import glob from 'glob'
import mkdirp from 'mkdirp'
import path from 'path'
import { MigrationHelper } from './lib/MigrationHelper'

type Options = {
  source: string
  target?: string
}

function processFile(source: string, target: string, fileName: string) {
  const migrationHelper = new MigrationHelper(source)

  // get final code
  const code = migrationHelper.getCode()
  const targetPath = path.resolve(target, fileName)

  console.info(chalk.yellow(`☞   ${source}`))

  if (process.env.NODE_ENV === "development") {
    // log code
    console.log(code)
  } else {
    // write file
    fs.writeFileSync(targetPath, code)
  }

  console.info(chalk.green(`✔   ${targetPath}`))
}

export function vue2MigrationHelper({ source, target }: Options): void {
  // check if source directory exists
  if (!fs.existsSync(source)) {
    throw new Error(`Invalid source path: ${source}`)
  }

  // define target path
  const targetPath = path.dirname(target || source)

  // make sure target path exists
  mkdirp.sync(targetPath)

  // check if source is single file or directory
  if (fs.lstatSync(source).isFile()) {
    processFile(source, targetPath, path.basename(target||source))
  } else {
    const sourceGlob = path.resolve(source, '**/*.vue').replace('\\', '/')

    // process each .vue file in source direcotry
    glob(sourceGlob, (err, sources) => {
      if (err) console.error(chalk.red(err))

      sources.forEach(source => {
        processFile(source, targetPath, path.basename(source))
      })
    })
  }
}

export default {
  vue2MigrationHelper
}
