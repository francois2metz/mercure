var express = require('express');

var app = express();
app.use(express.bodyParser());

app.get('/test.mp3', function(req, res) {
    app.emit('download', req);
    res.send('test');
});

app.get('/New One.mp3', function(req, res) {
    res.send('test');
});

app.get('/downloadattachment', function(req, res) {
    res.set({
        'Content-Disposition': 'attachment; filename="My Shiny mp3.mp3"'
    });
    res.send('test');
});

app.get('/baddownloadattachment', function(req, res) {
    res.set({
        'Content-Disposition': 'attachment; filename=""'
    });
    res.send('test');
});

app.post('/callback', function(req, res) {
    app.emit('callback', req);
    res.send(200);
});

exports.app = app;
