const AbstractStrategy = require('./abstract-strategy');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');

class LocalStrategy extends AbstractStrategy {
    constructor(fileName = 'migration-data') {
        super();

        this.fileName = `${fileName}.json`;
    }
    lastMigrationDate() {
        return new Promise((resolve, reject) => {
            const cwd = process.cwd();
            const moduleToLoad = path.join(cwd, this.fileName);
            try {
                const jsonData = require(moduleToLoad);
                const lastMigration = _.last(jsonData.migrations);
                resolve(lastMigration ? lastMigration.date : 0);
            } catch (e) {
                resolve(0);
            }
        });
    }
    commitMigration(migrationDt, migrationName) {
        return new Promise((resolve, reject) => {
            const cwd = process.cwd();
            const moduleToLoad = path.join(cwd, this.fileName);

            const migration = {
                date: migrationDt,
                name: migrationName
            };

            let currentMigrationInfo = { migrations: [] };
            try {
                currentMigrationInfo = require(moduleToLoad)
            } catch(e) {}

            currentMigrationInfo.migrations.push(migration);

            fs.writeFileSync(moduleToLoad, JSON.stringify(currentMigrationInfo));

            resolve();
        });
    }
}

module.exports = new LocalStrategy();