var express = require('express');
var outletManager = require('./outlet-manager');
var routerInfo = require('../network/router-info/router-info');

var TARGET = 'FC-DB-B3-42-4C-18';
var router = express.Router();

router.get('/state', (req, res) => {
    if (typeof req.query.name === "undefined") {
        res.json(outletManager.getAll());
    } else {
        let outlet = outletManager.getState(req.query.name);
        if (!outlet) {
            return respondWith404(res, req.query.name);
        }
        res.json(outlet);
    }
});

router.get('/toggle', (req, res) => {
    var outlet = outletManager.getState(req.query.name);
    if (!outlet) {
        return respondWith404(res, req.query.name);
    }
    res.json(outletManager.toggle(req.query.name));
});

function respondWith404(res, name) {
    res.status(404);
    res.json({
        error: `${name} is not a valid outlet name`
    });
}

/*
    Communicate with router to detect if phone is connected to network
*/
// routerInfo.fetchConnectedClientsTimer(30000, (clients) => {
//     var hasTarget = clients.some((client) => {
//         return client === TARGET;
//     });
//     console.log('Connected Clients:', clients, hasTarget);
//     console.log('Memory consumption:', routerInfo.getDataUsageInBytes(), 'bytes');
//     outletManager.getAllAsList().forEach((outlet) => outletManager.setState(outlet.name, {
//         isOn: true
//     }));
// }, (error) => console.error('Error fetching connected clients from router', error));

module.exports = router;