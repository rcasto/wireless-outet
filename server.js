var express = require('express');
var path = require('path');
var outletAPI = require('./lib/outlet-api');
var activityHook = require('./lib/activityHook');

var app = express();
var port = process.env.PORT || 3000;

app.use('/api', outletAPI);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

activityHook.init();
app.listen(port, () => console.log(`Server listening on port ${port}`));