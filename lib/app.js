var express = require('express');
var downloader = require('./downloader').downloader;

var app = express();

app.set('token', '__please_people_change_this__');

app.post('/download', function(req, res){
    if (!req.query.url || !req.query.token)
        return res.send(400);
    if (req.query.token !== app.get('token'))
        return res.send(400);
    res.send(202);
    downloader(req.query.url, req.query.callback);
});

exports.app = app;
