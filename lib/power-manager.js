var outlets = require('../outlets.json');
var helpers = require('./helpers');
var fs = require('fs');
var rpio = helpers.getRpio(process.platform);

function initPins() {
    Object.keys(outlets).forEach(
        (name) => rpio.open(outlets[name].pin, rpio.OUTPUT, outlets[name].isOn ? rpio.LOW : rpio.HIGH));
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
    try {
        // Save outlet states to file before close
        fs.writeFileSync('outlets.json', helpers.prettyPrint(outlets));
    } catch (error) {
        console.error(`Error writing outlet state on close: ${error}`);
    } finally {
        Object.keys(outlets).forEach((name) => {
            rpio.mode(outlets[name].pin, rpio.INPUT);
            rpio.pud(outlets[name].pin, outlets[name].isOn ? rpio.PULL_DOWN : rpio.PULL_UP);
            rpio.close(outlets[name].pin, rpio.PIN_PRESERVE);
        });
        process.exit();
    }
}

process.on('exit', cleanup);
process.on('SIGINT', cleanup);

module.exports = (function () {
    initPins();
    return {
        setPower
    };
}());