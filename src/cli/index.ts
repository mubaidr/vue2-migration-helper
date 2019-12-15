#!/usr/bin/env node
import { green, red } from 'chalk'
import glob from 'glob'
import { resolve } from 'path'
import { scriptName } from 'yargs'
// const fs = require('fs')
import { vue2MigrationHelper } from '../index'

const options = scriptName('vue2-migration-helper')
  .option('source', {
    alias: ['s'],
    describe: 'Source directory containing Vue single file components.',
    demandOption: true
  })
  .option('target', {
    alias: ['t'],
    describe: 'Target directory to save transformed components.',
    demandOption: false
  })
  .option('dry-run', {
    alias: ['d', 'dryRun'],
    describe: 'Target directory to save transformed components.',
    demandOption: false,
    default: false
  })
  .help()
  .example('vue2-migration-helper --dry-run --s="source" --t="target"').argv

const sourceGlob = resolve(options.source, '**/*.vue').replace('\\', '/')

glob(sourceGlob, (err, sources) => {
  if (err) console.error(red(err))

  sources.forEach(source => {
    console.log(green(`Processing: ${source}`))

    const content = vue2MigrationHelper({
      path: source
    })

    console.log(content)

    // fs.writeFileSync(path, content)
  })
})
