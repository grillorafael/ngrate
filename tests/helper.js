const path = require('path');
const fs = require('fs');
const exec = require('child_process').exec;

const BaseExec = path.join(__dirname, '..', 'commands', 'ngrate.js');
const DefaultMigrationDir = 'migrations';

exports.BaseExec = BaseExec;
exports.DefaultMigrationDir = DefaultMigrationDir;

exports.buildCommand = function() {
    let args = Array.prototype.slice.apply(arguments);
    return `${BaseExec} ${args.join(' ')}`;
};

exports.deleteAll = (cwd, extraDirs = []) => {
    [DefaultMigrationDir].concat(extraDirs)
        .forEach(d => deleteFolderRecursive(path.join(cwd, d)));
};

exports.exec = (cmd, cwd) => {
    return new Promise((resolve, reject) => exec(cmd, {cwd}, resolve));
};

function deleteFolderRecursive(path) {
    if(fs.existsSync(path)) {
        fs.readdirSync(path).forEach(file => {
            const curPath = path + "/" + file;
            if(fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else fs.unlinkSync(curPath);
        });
        fs.rmdirSync(path);
    }
}
