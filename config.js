const path = require('path');
const log = require('./log');
const MigrationDir = 'migrations';
const CustomConfigModule = path.join(process.cwd(), '.ngrate.js');

let config = {
    migrationsDir: MigrationDir,
    strategy: require('./strategies/local-strategy')
};

try {
    config = Object.assign({}, config, require(CustomConfigModule));
} catch(e) {
    log.warn('Custom config not found. Using default instead.')
}

module.exports = config;
