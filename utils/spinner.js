const ora = require('ora')
var spinner;
exports.start_spinner = function (args = '') {
    spinner = ora().start(args);
}

exports.stop_spinner = function () {
    spinner.stop()
}