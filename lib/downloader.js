var request = require('superagent');
var fs      = require('fs');
var path    = require('path');

function downloader(url, callback_url) {
    console.log('Downloading', url);
    var filename = path.basename(url);
    if (filename[filename.length - 1] == '/') {
        filename = 'index';
    }
    var file = fs.createWriteStream('data/'+ filename);
    var req = request.get(url);
    req.pipe(file);
    // HACK! to bypass this https://github.com/visionmedia/superagent/issues/94
    req._callback = downloadEnd(url, callback_url, file);
}

function downloadEnd(url, callback_url, file) {
    return function(res) {
        console.log('Download of '+ url +" ended: "+ res.status);
        if (res.header['content-disposition']) {
            var matches = res.header['content-disposition'].match(/attachment; filename="(.+)"/);
            if (matches) {
                var filename = path.basename(matches[1]);
                fs.renameSync('data/'+ path.basename(url), 'data/'+ filename);
            }
        }
        webhookCall(url, callback_url)(res);
    }
}

function webhookCall(url, callback_url) {
    return function(res) {
        if (callback_url) {
            request.post(callback_url)
                .type('json')
                .send({
                    url: url,
                    status: res.status,
                    size: res.header['content-length']
                })
                .end(function() {});
        }
    }
}

exports.downloader = downloader;
