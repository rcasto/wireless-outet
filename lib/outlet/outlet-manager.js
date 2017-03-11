/*
    Outlet config is defined as a list of outlet state objects
    Each of these objects has the following structure:
    {
        "<outlet-name>": {
            isOn: boolean, - Whether the outlet is powered or not
            pin: number   - Physical pin # on board that outlet is connected to
        }
    }
*/
var outlets = require('./outlets.json');
var powerManager = require('./power-manager');

function init() {
    Object.keys(outlets).forEach((name) => outlets[name].name = name);
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
    if (state) {
        outlets[name] = {
            isOn: state.isOn || outlets[name].isOn,
            pin: state.pin || outlets[name].pin
        };
        powerManager.setPower(outlets[name]);
    }
    return outlets[name] || null;
}

function toggle(name) {
    if (outlets[name]) {
        outlets[name].isOn = !outlets[name].isOn;
        powerManager.setPower(name);
    }
    return outlets[name] || null;
}

init();

module.exports = {
    getState,
    getAll,
    getAllAsList,
    setState,
    toggle
};