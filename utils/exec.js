const exec = require('child_process').exec;
module.exports = (cmd) => {
    return new Promise((resolve, reject) => {
        exec(cmd, (err, stdout, stderr) => {
            if (stdout) {
                return resolve(stdout);
            }
            console.log(stderr);
            resolve(false);
        })
    })
}