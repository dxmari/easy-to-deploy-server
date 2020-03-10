const net = require('net');
const EventEmitter = require('events');

const ManipulateJSON = require('../utils/manipulate-json')
const exec = require('../utils/exec')
const emitter = new EventEmitter();
var connection, server;
class NetServer {
    constructor() {
        this.emitter = emitter;
    }
    connect(args) {
        server = net.createServer(function (conn) {
            console.log("Server: Client connected");
            connection = conn;
            // If connection is closed
            conn.on("end", function () {
                console.log('Server: Client disconnected');
                // Close the server
                // server.close();
                // End the process
                // process.exit(0);
            });

            // Handle data from client
            new NetServer().onReceiveMsgFromClient();

            // Let's response with a hello message
            var appList = ManipulateJSON.path('./config.json').get('apps').map(e => {
                return {
                    title: e.name + ` (#${e.id})`,
                    value: e.id
                }
            });
            new NetServer().sendMsgToClient({
                type: 'AppList',
                data: appList
            });
        });
        let netPort = args.port || 61337, netHost = args.host || "0.0.0.0";
        server.listen(parseInt(netPort), netHost, function () {
            console.log("Server: Listening on " + netHost + ':' + netPort);
        });
    }

    disconnect() {
        server.close();
    }

    sendMsgToClient(msg) {
        connection.write(
            JSON.stringify(msg)
        );
    }

    onReceiveMsgFromClient() {
        connection.on("data", async (data) => {
            data = JSON.parse(data);
            console.log("Response received from client:", JSON.stringify(data));
            if (data.type === 'deploy') {
                let app = ManipulateJSON
                    .path('./config.json')
                    .get({
                        key: 'apps',
                        cond: {
                            $or: [{
                                id: data.data.pid
                            }]
                        }
                    })
                var cmd = 'cd ' + app.rootPath;
                if (!app.script) {
                    console.log(cmd + ' && ' + app.script);
                    try {
                        let response = await exec(cmd + ' && ' + app.script);
                        new NetServer().sendMsgToClient({
                            type: 'scriptResponse',
                            data: response
                        });
                        setTimeout(() => {
                            new NetServer().sendMsgToClient({
                                type: 'success',
                                data: 'Deployed Successfully.'
                            })
                        }, 1000);

                    } catch (error) {
                        new NetServer().sendMsgToClient({
                            type: 'error',
                            data: error
                        })
                    }
                } else {
                    new NetServer().sendMsgToClient({
                        type: 'error',
                        data: "No scripts found..."
                    })
                }
            }
        });
    }
}

var netServer = new NetServer();
module.exports = {
    NetServer: netServer
}