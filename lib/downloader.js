var request = require('superagent');
var fs      = require('fs');
var path    = require('path');

function downloader(url, callback_url) {
    console.log('Downloading', url);

    var file = fs.createWriteStream(dataPath(extractFilename(url)));
    var req = request.get(url);
    req.pipe(file);
    // HACK! to bypass this https://github.com/visionmedia/superagent/issues/94
    req._callback = downloadEnd(url, callback_url, file);
}

function downloadEnd(url, callback_url, file) {
    return function(err, res) {
        if (err) {
            console.log('Download of '+ url +" error: "+ err);
            webhookCall(url, callback_url, {
                status: 'error',
                size: 0
            });
        } else {
            console.log('Download of '+ url +" ended: "+ res.status);
            var filename;
            if (res.status != 200) {
                fs.unlinkSync(file.path);
            } else if (filename = extractFilenameFromHeaders(res)) {
                console.log('rename from', file.path, 'to', filename);
                fs.renameSync(file.path, dataPath(filename.trim()));
            }
            webhookCall(url, callback_url, {
                status: res.status,
                size: res.header['content-length']
            });
        }
    }
}

function webhookCall(url, callback_url, options) {
    if (callback_url) {
        request.post(callback_url)
            .type('json')
            .send({
                url: url,
                status: options.status,
                size: options.size
            })
            .end(function() {});
    }
}

function extractFilename(url) {
    var filename = path.basename(url);
    if (filename[filename.length - 1] == '/') {
        filename = 'index';
    }
    return filename;
}

function dataPath(filename) {
    return 'data/'+ filename;
}

function extractFilenameFromHeaders(res) {
    if (res.header['content-disposition']) {
        var matches = res.header['content-disposition'].match(/attachment; filename="?([^"]+)"?/);
        if (matches) {
            return extractFilename(matches[1]);
        }
    }
    return false;
}

exports.downloader = downloader;
