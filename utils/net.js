const net = require('net');

class NetServer {
    constructor() {
        this.server = "";
    }
    connect(args) {
        this.server = net.createServer(function (conn) {
            console.log("Server: Client connected");

            // If connection is closed
            conn.on("end", function () {
                console.log('Server: Client disconnected');
                // Close the server
                // server.close();
                // End the process
                // process.exit(0);
            });

            // Handle data from client
            conn.on("data", function (data) {
                data = JSON.parse(data);
                console.log("Response from client: %s", data.response);
            });

            // Let's response with a hello message
            conn.write(
                JSON.stringify(
                    { response: "Hey there client!" }
                )
            );
        });
        let netPort = args.port || 61337, netHost = args.host || "0.0.0.0";
        this.server.listen(parseInt(netPort), netHost, function () {
            console.log("Server: Listening on " + netHost + ':' + netPort);
        });
    }

    disconnect() {
        this.server.close();
    }
}

const netServer = new NetServer();

module.exports = {
    NetServer: netServer
}