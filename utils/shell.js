var shell = require('shelljs');

module.exports = function (command, timeout = (10 * (60 * 1000))) {
    return new Promise((resolve, reject) => {
        let t = setTimeout(() => {
            resolve("timeout");
        }, timeout);
        let result = shell.exec(command);
        if (result.stdout) {
            clearTimeout(t);
            resolve(result.stdout);
        } else {
            clearTimeout(t);
            reject(result.stderr);
        }
    })
}