class AbstractStrategy {
    constructor() {

    }
    lastMigrationDate() {
        throw new Exception('Not Implemented');
    }
    commitMigration(migrationDt, migrationName) {
        throw new Exception('Not Implemented');
    }
}

module.exports = AbstractStrategy;