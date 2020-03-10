const minimist = require('minimist');
const { show, start, restart, stop, deleteApp, logs, config } = require('./cmds/core')
const error = require('./utils/error-handle')
module.exports = () => {
    const args = minimist(process.argv.slice(2))
    let cmd = args._[0] || 'help'

    if (args.version || args.v) {
        cmd = 'version'
    }

    if (args.help || args.h) {
        cmd = 'help'
    }

    switch (cmd) {
        case 'version':
            require('./cmds/version')(args)
            break

        case 'help':
            require('./cmds/help')(args)
            break

        case 'start':
            if (!args._[1]) {
                require('./cmds/help')(args)
                break;
            }
            args['name'] = args._[1];
            start(args)
            break

        case 'config':
            if (!args._[1]) {
                require('./cmds/help')(args)
                break;
            }
            args['param'] = args._[1];
            config(args)
            break

        case 'restart':
            if (args._[1] !== 0 && !args._[1]) {
                require('./cmds/help')(args)
                break;
            }
            args['param'] = args._[1];
            restart(args)
            break
        case 'show':
            if (args._[1] !== 0 && !args._[1]) {
                require('./cmds/help')(args)
                break;
            }
            args['param'] = args._[1];
            show(args)
            break
        case 'stop':
            if (args._[1] !== 0 && !args._[1]) {
                require('./cmds/help')(args)
                break;
            }
            args['param'] = args._[1];
            stop(args)
            break
        case 'delete':
            if (args._[1] !== 0 && !args._[1]) {
                require('./cmds/help')(args)
                break;
            }
            args['param'] = args._[1];
            deleteApp(args)
            break
        case 'logs':
            if (args._[1] !== 0 && !args._[1]) {
                require('./cmds/help')(args)
                break;
            }
            args['param'] = args._[1];
            logs(args)
            break
        default:
            error(`"${cmd}" is not a valid command!`, true)
            break
    }
}