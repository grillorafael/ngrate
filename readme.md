# ngrate [![Build Status](https://travis-ci.org/grillorafael/ngrate.svg)](https://travis-ci.org/grillorafael/ngrate)

[![NPM](https://nodei.co/npm/ngrate.png)](https://nodei.co/npm/ngrate/)

This is a ultra simple, database agnostic, migrations library based on ES6 Promises.

`npm install ngrate --save`

## Creating a new migration

To create a new migration simply run

`ngrate create migration-name`

This will generate a file under 'migrations/' folder with the timestamp and the name.

The file will look like the this code below:

```javascript
const name = 'create-user-table';
const createdAt = 1476651301760;

exports.createdAt = createdAt;
exports.name = name;

exports.up = () => {
    return new Promise((resolve, reject) => {
        //TODO: Write migration code
        resolve();
    });
};

exports.down = () => {
    return new Promise((resolve, reject) => {
        //TODO: Write migration code
        resolve();
    });
};
```

From this, you should require the databases you need and do your operation.

## Running specific migrations

You can run a specific migration by using the command `up` or `down`.

`ngrate up migrations/yourmigrationfile.js`

`ngrate down migrations/yourmigrationfile.js`

## Execute pending migrations

To run pending migrations just type

`ngrate run`

This will get the last migration execution and run the next one forward. Running one by one until all succeed or one fails.

In case one migration fails, the state left will be up to the latest successful migration

## Strategies

ngrate is based on migration strategies which is a interface that can be found [here](https://github.com/grillorafael/ngrate/blob/master/strategies/abstract-strategy.js)

You can write your own strategy by implementing those methods. By default, this library comes with a local file strategy.

## Customizing strategy

You can customize your strategy by creating a file called `.ngrate.js`

This file should look like this

````javascript
module.exports = {
    migrationsDir: 'migrations',
    strategy: require('./strategies/local-strategy')
};
````

Where `strategy` is a new instance of your AbstractStrategy implementation.

## Available Strategies

I'm going to write new strategies for the following databases:
1. MongoDB
1. Redis

If you have any suggestion, just create an issue.

Strategies should not exist within this code base. The implementations should exist as separate modules.
