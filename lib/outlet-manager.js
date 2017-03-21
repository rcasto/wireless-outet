/*
    Outlet config is defined as a list of outlet state objects
    Each of these objects has the following structure:
    {
        "<outlet-name>": {
            pin: number   - Physical pin # on board that outlet is connected to
        }
    }
*/
var outlets = require('../outlets.json');
var powerManager = require('./power-manager');
var helpers = require('./helpers');

function init() {
    getAllAsList().forEach((outlet) => {
        outlet.isOn = true;
        powerManager.bootup(outlet.pin, true);
    });
    process.on('exit', cleanup);
    process.on('SIGINT', cleanup);
}

function getAll() {
    return outlets;
}

function getAllAsList() {
    return Object.keys(outlets).map((name) => outlets[name]);
}

function getState(name) {
    return outlets[name] || null;
}

function setState(name, state) {
    var outlet = getState(name);
    if (outlet) {
        if (state) {
            outlet.isOn = helpers.isDefined(state.isOn) ? state.isOn : outlet.isOn;
            outlet.pin = helpers.isDefined(state.pin) ? state.pin : outlet.pin;
            powerManager.setPower(outlet.pin, outlet.isOn);
        }
        return outlet;
    }
    return null;
}

function toggle(name) {
    var outlet = getState(name);
    if (outlet) {
        return setState(name, {
            isOn: !outlet.isOn
        });
    }
    return null;
}

function cleanup() {
    getAllAsList().forEach(
        (outlet) => powerManager.shutdown(outlet.pin, true));
    process.exit();
}

module.exports = (function () {
    init();
    return {
        getState,
        setState,
        getAll,
        getAllAsList,
        toggle
    };
}());