var messengerClient = require('messenger').client;
var config = require('../config.json');

var connectionUrl = `${config.remoteProtocol}://${config.remoteHost}:${config.remotePort}`;
var socket = null;

function onError(error) {
    console.error(`Error occurred: ${error}`);
}

function messageHandler(message) {
    console.log(`Message received from server: ${JSON.stringify(message)}`);
}

/* Initialize socket connection to server */
function init() {
    if (socket) return;

    messengerClient.connect(connectionUrl, (data, flags) => {
        helpers.log(`Server message: ${data} : ${flags}`);
    }).then(_socket => {
        helpers.log(`Socket connection to server established`);
        socket = _socket;
        socket.on('message', messageHandler);
    }, onError);
}

module.exports = {
    init
};