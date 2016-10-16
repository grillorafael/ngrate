#!/usr/bin/env node

const program = require('commander');
const log = require('../log');
const path = require('path');

program.parse(process.argv);

const migrationFileName = program.args ? program.args[0] : undefined;

if(migrationFileName) {
    log.info(`Opening migration file ${migrationFileName}`);
    const migration = require(path.join(process.cwd(), migrationFileName));
    log.info(`Running up migration`);
    migration.up(() => log.info('Migration finished'));
} else log.error('Cannot create migration. Name not specified');