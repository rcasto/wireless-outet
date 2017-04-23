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
    pud: (pin, resistor) => {
        console.log(`Set pullup/pulldown resistor on pin ${pin}: ${resistor}`);
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

function isDefined(x) {
    return typeof x !== "undefined";
}

module.exports = {
    rpioMock,
    getRpio,
    isDefined
};