
const { NetServer } = require('./utils/net');
const args = {
    host: (process.env.host == 'undefined' || !process.env.host) ? '0.0.0.0' : process.env.host,
    port: (process.env.port == 'undefined' || !process.env.port) ? 61337 : process.env.port
};
console.log(args);
NetServer.connect(args);