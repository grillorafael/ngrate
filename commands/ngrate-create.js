#!/usr/bin/env node

const program = require('commander');
const log = require('../log');
const fs = require('fs');
const path = require('path');

program.parse(process.argv);

let config = require('../config');

const MigrationDir = config.migrationsDir;
const MigrationTemplate = fs.readFileSync(path.join(__dirname, '..', 'migration-template.tjs'), 'utf8');

const migrationName = program.args ? program.args[0] : undefined;

if(migrationName) {
    const at = new Date().valueOf();
    const fileName = `${at}_${migrationName}.js`;
    const destinationFile = path.join(process.cwd(), MigrationDir, fileName);

    log.info(`Creating file ${destinationFile}`);

    if(!fs.existsSync(MigrationDir)) fs.mkdirSync(MigrationDir);

    const migrationContent =
        MigrationTemplate.replace(/<Name>/g, migrationName).replace(/<CreatedAt>/g, at);

    fs.writeFileSync(destinationFile, migrationContent, 'utf8');
} else log.error('Cannot create migration. Name not specified');
