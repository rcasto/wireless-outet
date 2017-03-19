var express = require('express');
var outletManager = require('./outlet-manager');

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

module.exports = router;