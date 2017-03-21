var helpers = require('./helpers');
var rpio = helpers.getRpio(process.platform);

function bootup(pin, isOn) {
    rpio.open(pin, rpio.OUTPUT, isOn ? rpio.LOW : rpio.HIGH);
}

function setPower(pin, isOn) {
    let power_state = isOn ? rpio.LOW : rpio.HIGH;
    rpio.write(pin, power_state);
}

function shutdown(pin, shouldPreserve) {
    rpio.close(pin, shouldPreserve ? rpio.PIN_PRESERVE : rpio.PIN_RESET);
}

module.exports = {
    bootup,
    setPower,
    shutdown
};