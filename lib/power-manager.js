var helpers = require('./helpers');
var rpio = helpers.getRpio(process.platform);

function bootup(pin, isOn) {
    rpio.open(pin, rpio.OUTPUT, getPowerState(isOn));
}

function setPower(pin, isOn) {
    rpio.write(pin, getPowerState(isOn));
}

function shutdown(pin, shouldPreserve) {
    rpio.close(pin, shouldPreserve ? rpio.PIN_PRESERVE : rpio.PIN_RESET);
}

function getPowerState(isOn) {
    return isOn ? rpio.LOW : rpio.HIGH;
}

module.exports = {
    bootup,
    setPower,
    shutdown
};