var messengerClient = require('messenger').client;
var config = require('../config.json');
var outletManager = require('./outlet-manager');

var connectionUrl = `${config.remoteProtocol}://${config.remoteHost}:${config.remotePort}`;
var socket = null;

function onError(error) {
    console.error(`Error occurred: ${error}`);
}

function messageHandler(message) {
    console.log(`Message received from server: ${JSON.stringify(message)}`);
    if (message && 
        message.type === 'activity' &&
        typeof message.data === 'number') {
        outletManager
            .getAllNames()
            .forEach((name) => outletManager.setState(name, {
                isOn: message.data > 0
            }));
    }
}

/* Initialize socket connection to server */
function init() {
    if (socket) return;
    messengerClient.connect(connectionUrl, messageHandler)
        .then(_socket => {
            console.log(`Socket connection to server established`);
            socket = _socket;
        }, onError);
}

module.exports = {
    init
};