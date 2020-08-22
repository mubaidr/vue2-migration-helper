#!/usr/bin/env node
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { yellow } from 'chalk'
// @ts-ignore
import { vue2MigrationHelper } from 'vue2-migration-helper'
import { scriptName } from 'yargs'

const options = scriptName('vue2-migration-helper')
  .option('source', {
    alias: ['s'],
    describe: 'Source directory containing Vue single file components.',
    demandOption: true,
    type: 'string',
  })
  .option('target', {
    alias: ['t'],
    describe: 'Target directory to save transformed components.',
    demandOption: false,
    type: 'string',
  })
  .help()
  .example('vue2-migration-helper --source="source" --target="target"', '').argv

if (!options['target']) {
  console.log(
    yellow('`target` option is not specified, files will be overwritten. ')
  )
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
vue2MigrationHelper({
  source: options.source,
  target: options.target,
})
