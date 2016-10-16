#!/usr/bin/env node

const program = require('commander');
const log = require('../log');

const RunCmd = 'run';
const UpCmd = 'up';
const DownCmd = 'down';
const CreateCmd = 'create';

program
    .version(require('../package.json').version)
    .command(`${RunCmd}`, 'Run migrations')
    .command(`${UpCmd} [file]`, 'Runs migration up')
    .command(`${DownCmd} [file]`, 'Runs migration down')
    .command(`${CreateCmd} [migrationName]`, 'Creates a new migration')
    .parse(process.argv);