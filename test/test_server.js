var express = require('express');

var app = express();
app.use(express.bodyParser());

app.get('/test.mp3', function(req, res) {
    app.emit('download', req);
    res.send('test');
});

app.post('/callback', function(req, res) {
    app.emit('callback', req);
    res.send(200);
});

exports.app = app;
