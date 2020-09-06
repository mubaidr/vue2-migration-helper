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
  if (process && process.env.NODE_ENV !== 'test') {
    console.info(chalk.yellow(`☞   ${source}`))
  }

  // get final code
  const code = new MigrationHelper(source).getCode()

  if (process && process.env.NODE_ENV === 'test') return

  // write target file
  const targetPath = path.resolve(target, fileName)
  fs.writeFileSync(targetPath, code)
  console.info(chalk.green(`✔   ${targetPath}`))
}

export function vue2MigrationHelper({ source, target }: Options): void {
  const src = path.resolve(source)
  let targetPath = ''

  // check if source is single file or directory
  if (fs.lstatSync(src).isFile()) {
    if (target) {
      if (!fs.existsSync(target)) {
        mkdirp.sync(target)
      }

      targetPath = target
    } else {
      targetPath = path.dirname(src)
    }

    processFile(src, targetPath, path.basename(target || src))
  } else {
    const sourceGlob = path.resolve(src, '**/*.vue').replace(/\\/gi, '/')

    targetPath = target ? target : src

    // process each .vue file in source direcotry
    glob.sync(sourceGlob, { nodir: true }).forEach((source) => {
      processFile(source, targetPath, path.basename(source))
    })
  }
}

export default {
  vue2MigrationHelper,
}
