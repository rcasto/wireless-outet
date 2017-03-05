var express = require('express');
var rpio = require('rpio');

var router = express.Router();
var outlets = [{
    name: 'Outlet 1',
    isOn: false,
    pin: 10,
    id: 0
}, {
    name: 'Outlet 2',
    isOn: false,
    pin: 11,
    id: 1
}];

// Configure outlet pins
initPins();

router.get('/state/:id?', (req, res) => {
    if (typeof req.params.id === "undefined") {
        res.json(outlets);
    } else {
        let outlet = parseAndGetOutlet(req.params.id);
        if (!outlet) {
            return respondWith404(res, req.params.id);
        }
        res.json(outlet);
    }
});

router.get('/toggle/:id', (req, res) => {
    var outlet = parseAndGetOutlet(req.params.id);
    if (!outlet) {
        return respondWith404(res, req.params.id);
    }
    let output_voltage = rpio.HIGH;
    if (!outlet.isOn) {
        output_voltage = rpio.LOW;
    }
    outlet.isOn = !outlet.isOn;
    rpio.write(outlet.pin, output_voltage);
    res.json(outlet);
});

function parseAndGetOutlet(id) {
    id = Number.parseInt(id, 10);
    if (isNaN(id) || !outlets[id]) {
        return null;
    }
    return outlets[id];
}

function respondWith404(res, id) {
    res.status(404);
    res.json({
        error: `${id} is not a valid id`
    });
}

function initPins() {
    outlets.forEach(function (outlet) {
        rpio.open(outlet.pin, rpio.OUTPUT, rpio.HIGH);
    });
}

function cleanup() {
    outlets.forEach(function (outlet) {
        rpio.close(outlet.pin);
    });
    process.exit();
}

// Cleanup when stopping scans
process.on('exit', cleanup);
process.on('SIGINT', cleanup);

module.exports = router;