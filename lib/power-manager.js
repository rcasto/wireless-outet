var outlets = require('../outlets.json');
var helpers = require('../helpers');
var fs = require('fs');
var rpio = helpers.isWindows(process.platform) ? helpers.rpioMock : require('rpio');

function initPins() {
    Object.keys(outlets).forEach(
        (name) => rpio.open(outlets[name].pin, rpio.OUTPUT, rpio.HIGH));
}

function setPower(name, isOn) {
    if (!outlets[name]) {
        return;
    }
    isOn = typeof isOn === "undefined" ? outlets[name].isOn : isOn;
    let power_state = isOn ? rpio.LOW : rpio.HIGH;
    rpio.write(outlets[name].pin, power_state);
}

function cleanup() {
    // Save outlet state to file before close
    fs.writeFile('./outlets.json', outlets, function (error) {
        if (error) {
            console.error('Error writing outlet state on close:', error);
        }
        Object.keys(outlets).forEach((name) => rpio.close(outlets[name].pin));
        process.exit();
    });
}

process.on('exit', cleanup);
process.on('SIGINT', cleanup);

initPins();

module.exports = {
    setPower
};