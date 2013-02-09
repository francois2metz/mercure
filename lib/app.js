var express = require('express');
var downloader = require('./downloader').downloader;

var app = express();

app.post('/download', function(req, res){
    if (!req.query.url)
        return res.send(400);
    res.send(200);
    downloader(req.query.url, req.query.callback);
});

exports.app = app;
