#!/usr/bin/env node
import { green, red, yellow } from 'chalk'
import glob from 'glob'
import { resolve } from 'path'
import { scriptName } from 'yargs'
import { vue2MigrationHelper } from '../index'

const options = scriptName('vue2-migration-helper')
  .option('source', {
    alias: ['s'],
    describe: 'Source directory containing Vue single file components.',
    demandOption: true,
    type: 'string'
  })
  .option('target', {
    alias: ['t'],
    describe: 'Target directory to save transformed components.',
    demandOption: false,
    type: 'string'
  })
  .option('dry-run', {
    alias: ['d', 'dryRun'],
    describe: 'Target directory to save transformed components.',
    demandOption: false,
    default: false,
    type: 'boolean'
  })
  .help()
  .example('vue2-migration-helper --dry-run --s="source" --t="target"', '').argv

if (options['dry-run']) {
  console.log(
    yellow(
      'vue2-migration-helper in dry-run mode, no files will be written to disk.'
    )
  )
}

const sourceGlob = resolve(options.source, '**/*.vue').replace('\\', '/')

glob(sourceGlob, (err, sources) => {
  if (err) console.error(red(err))

  sources.forEach(source => {
    console.log(green(`Processing: ${source}`))

    // TODO: pass target file
    vue2MigrationHelper({
      source: source,
      dryRun: options.dryRun === true ? true : false
    })

    console.log(green('Succesffuly processed file: ', source))
  })
})
