var request = require('superagent');
var fs      = require('fs');
var path    = require('path');

function downloader(url, callback_url) {
    console.log('Downloading', url);

    var file = fs.createWriteStream('data/'+ path.basename(url));
    var req = request.get(url);
    req.pipe(file);
    req.end(webhookCall(url, callback_url));
}

function webhookCall(url, callback_url) {
    return function(res) {
        console.log('Download of '+ url +" ended: "+ res.status);
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
