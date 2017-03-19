var linuxRegex = /^lin/;
var rpioMock = {
    write: (pin, voltage) => {
        console.log(`Wrote ${getVoltageString(voltage)} to pin ${pin}`);
    },
    open: (pin, mode, voltage) => {
        console.log(`Pin ${pin} open in ${mode} mode with initial voltage ${getVoltageString(voltage)}`);
    },
    close: (pin) => {
        console.log(`Pin ${pin} has been closed`);
    },
    HIGH: 1,
    LOW: 0,
    OUTPUT: 'output'
};

function getVoltageString(voltage) {
    return voltage > 0 ? 'HIGH' : 'LOW';
}

function getRpio(platform) {
    return linuxRegex.test(platform) ? require('rpio') : rpioMock;
}

function prettyPrint(json) {
    return JSON.stringify(json, null, '\t')
}

function deepClone(json) {
    try {
        return JSON.parse(JSON.stringify(json));
    } catch (error) {
        return null;
    }
}

module.exports = {
    rpioMock,
    getRpio,
    prettyPrint,
    deepClone
};