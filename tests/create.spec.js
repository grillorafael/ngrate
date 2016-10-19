const fs = require('fs');
const expect = require('expect.js');
const path = require('path');
const cwd = __dirname;
const _ = require('lodash');

const helper = require('./helper');

const Timeout = 10000;

describe('Create Command', function() {
    this.timeout(Timeout);

    const migrationsDir = path.join(cwd, helper.DefaultMigrationDir);
    function deleteAll() {
        helper.deleteAll(cwd)
    }

    beforeEach(deleteAll);
    afterEach(deleteAll);

    describe('default config', () => {
        it('should create migrations directory with migration name file', (done) => {
            let migrationName = 'test-migration';
            let cmd = helper.buildCommand('create', migrationName);
            helper.exec(cmd, cwd).then(() => {
                const migrationFiles = fs.readdirSync(migrationsDir);
                const migrationFilesThatMatch = migrationFiles.filter(f => f.includes(migrationName));
                expect(migrationFilesThatMatch).to.have.length(1);

                const fileName = _.first(migrationFilesThatMatch);
                const migrationModule = require(path.join(migrationsDir, fileName));

                expect(migrationModule.name).to.be.eql(migrationName);

                expect(migrationModule.up).to.be.a('function');
                expect(migrationModule.down).to.be.a('function');
                expect(migrationModule.createdAt).to.be.a('number');

                expect(migrationModule.up()).to.be.a(Promise);
                expect(migrationModule.down()).to.be.a(Promise);

                done();
            });
        });

        it('should create timely based file names', (done) => {
            let firstMigrationName = 'test-migration-1';
            let secondMigrationName = 'test-migration-2';
            let cmds = [firstMigrationName, secondMigrationName].map(name => helper.buildCommand('create', name));

            helper.exec(cmds[0], cwd)
                .then(() => helper.exec(cmds[1], cwd))
                .then(() => {
                    const migrationFiles = fs.readdirSync(migrationsDir);
                    expect(migrationFiles).to.have.length(2);

                    const first = require(path.join(migrationsDir, migrationFiles.find(f => f.includes(firstMigrationName))));
                    const second = require(path.join(migrationsDir, migrationFiles.find(f => f.includes(secondMigrationName))));

                    expect(second.createdAt).to.be.greaterThan(first.createdAt);

                    done();
                });
        });
    });
});
