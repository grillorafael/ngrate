#!/usr/bin/env node

const program = require('commander');
const log = require('../log');
const path = require('path');
const fs = require('fs');
const series = require('async/series');

program.parse(process.argv);

const CustomConfigModule = path.join(process.cwd(), '.ngrate.js');

const MigrationDir = 'migrations';

let config = {
    strategy: require('../strategies/local-strategy')
};

try {
    config = require(CustomConfigModule);
} catch(e) {
    log.warn('Custom config not found. Using default instead.')
}

const Strategy = config.strategy;

Strategy.lastMigrationDate()
    .then(d => {
        const pendingMigrations =
            fs.readdirSync(path.join(process.cwd(), MigrationDir))
                .map(m => require(path.join(process.cwd(), MigrationDir, m)))
                .filter(migration => migration.createdAt > d)
                .map(createMigrationTask);

        log.info(`Running ${pendingMigrations.length} new migrations`);
        series(pendingMigrations, (errors, results) => {
            log.info(`Finished running pending migrations with ${(errors || []).length} errors.`);
        });
    }, exitWithFailure('Failed to fetch last migration date'))
    .catch(exitWithFailure());

function createMigrationTask(migration) {
    return (cb) => {
        log.info('up', migration.name);
        migration.up().then(() => {
            log.info('up', migration.name, 'finished');
            config.strategy.commitMigration(migration.createdAt, migration.name)
                .then(() => {
                    log.info('migration change commited');
                    cb(null, migration)
                })
                .catch(e => {
                    log.error(`Migration commit failed for migration ${migration.name}`);
                    log.error('The migration ran successfully but the state didn\'t change');
                    cb(true);
                });
        }).catch(e => cb(true));
    };
}

function exitWithFailure(e = '') {
    return (error) => {
        log.error(`Failed to run migrations\n\n`, error);
        process.exit(1);  
    };
}