var express = require('express');
var path = require('path');
var toggleAPI = require('./toggle');

var app = express();
var port = process.env.PORT || 3000;

app.use('/api', toggleAPI);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

app.listen(port, () => console.log(`Server listening on port ${port}`));