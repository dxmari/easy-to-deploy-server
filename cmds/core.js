const path = require('path')
const exec = require('../utils/exec')
const shell = require('../utils/shell')
const spinner = require('../utils/spinner')
const ManipulateJSON = require('../utils/manipulate-json')
var { setup, apps } = require('../config.json')

const start = async (args) => {
    if (!setup) {
        let result = ManipulateJSON
            .path('./config.json')
            .set('setup', true)
            .save();
        if (!result) return;
        try {
            await initSetup();
        } catch (error) {
            console.log('setupError', error)
        }
    }
    var rootPath = await exec('pwd');
    rootPath = rootPath.replace(/\n/g, '');
    let isSaved = saveAppInfo(args.name, rootPath, args.host, args.port)
    if (isSaved) connectServer(args);
}

const connectServer = async (args) => {
    process.env.port = args.port;
    process.env.host = args.host;

    let resp = await exec('pm2 jlist');
    resp = JSON.parse(resp);
    let idx = resp.findIndex(e => e.name === 'easy-deploy');
    if (idx == -1) {
        let fpath = path.resolve(__dirname, "../", './app.js');
        console.log(fpath);
        await exec(`pm2 start ${fpath} --name easy-deploy`);
        exec('pm2 save');
    }

}

const restart = async (args) => {
    process.env.port = args.port;
    process.env.host = args.host;
    // let pm2ID = await getPM2ID(args);
    let pm2ID = "easy-deploy";
    await shell('pm2 restart ' + pm2ID);
}

const show = async (args) => {
    // let pm2ID = await getPM2ID(args);
    let pm2ID = "easy-deploy";
    await shell('pm2 show ' + pm2ID);
}

const getPM2ID = async (args) => {
    let app = ManipulateJSON
        .path('./config.json')
        .get({
            key: 'apps',
            cond: {
                $or: [{
                    name: args.param
                }, {
                    id: args.param
                }]
            }
        })
    if (app) {
        let resp = await exec('pm2 jlist');
        resp = JSON.parse(resp);
        let idx = resp.findIndex(e => e.name === app.name);
        if (idx >= 0) {
            return resp[idx].pm_id;
        }
    }
    return null;
}

const logs = async (args) => {
    // let pm2ID = await getPM2ID(args);
    let pm2ID = "easy-deploy";
    await shell('pm2 logs ' + pm2ID + (args.lines ? ' --lines ' + args.lines : ''));
}

const stop = async (args) => {
    // let pm2ID = await getPM2ID(args);
    let pm2ID = "easy-deploy";
    await exec('pm2 stop ' + pm2ID);
}

const initSetup = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let isPm2Exists = await checkPm2Exists();
            console.log(isPm2Exists)
            if (!isPm2Exists) {
                spinner.start_spinner("*******Installing PM2********\n")
                await shell('sudo npm i -g pm2');
                await shell('pm2 startup && pm2 save');
                spinner.stop_spinner()
            }
            resolve();
        } catch (error) {
            console.log('error', error);
            spinner.stop_spinner()
            reject(error);
        }
    })
}

const checkPm2Exists = () => {
    return exec('pm2 -v');
}

const saveAppInfo = (name, rootPath, host = "0.0.0.0", port = 61337) => {
    let appsArr = Array.isArray(apps) ? apps.map(e => e) : [];
    if (checkNameIfExists(name, appsArr)) {
        console.error(`
        The application name already exists.
        `)
        return false;
    }
    appsArr.push({
        id: findIdOfApp(appsArr.slice()),
        name: name,
        rootPath: rootPath,
        status: "running",
        host: host,
        port: port,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    return ManipulateJSON
        .path('./config.json')
        .set('apps', appsArr)
        .save();
}

const checkNameIfExists = (name, appsArr) => {
    return appsArr.findIndex(e => e.name.toLowerCase() === name.toLowerCase()) >= 0;
}

const findIdOfApp = (appsArr) => {
    var id = 1;
    if (appsArr.length > 0) {
        appsArr.sort(function (a, b) { return a.id - b.id });
        id = appsArr.pop().id + 1;
    }
    return id;
}

const deleteApp = async (args) => {
    ManipulateJSON
        .path('./config.json')
        .set({
            key: 'apps',
            type: 'remove',
            cond: {
                $or: [{
                    name: args.param
                }, {
                    id: args.param
                }]
            }
        })
        .save()
    if(args.param === 'easy-deploy'){
        await exec('pm2 delete ' + args.param)
        exec('pm2 save --force');
    }
}

const config = async (args) => {
    var param = args.param;
    delete args.param;
    delete args._;
    if (Object.keys(args).length > 0) {
        ManipulateJSON
            .path('./config.json')
            .set({
                key: 'apps',
                type: 'modify',
                data: args,
                cond: {
                    $or: [{
                        name: param
                    }, {
                        id: param
                    }]
                }
            })
            .save()
    }
}

module.exports = {
    start: start,
    restart: restart,
    show: show,
    stop: stop,
    deleteApp: deleteApp,
    logs: logs,
    config: config
}