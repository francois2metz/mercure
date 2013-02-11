var request     = require('supertest');
var app         = require('../lib/app').app;
var assert      = require('assert');
var fs          = require('fs');
var test_server = require('./test_server').app;

describe('POST /download', function() {
    before(function() {
        var files = fs.readdirSync(__dirname +'/../data');
        files.forEach(function(file) {
            fs.unlinkSync(__dirname + '/../data/'+ file);
        });
    });

    it('should fail when no url found', function(done) {
        request(app)
            .post('/download')
            .send()
            .expect(400, done);
    });

    it('should download the file', function(done) {
        var s = test_server.listen(function() {
            var base_url = 'http://localhost:'+ s.address().port;
            test_server.once('download', function() {done();});
            request(app)
                .post('/download?url='+ base_url +'/test.mp3')
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                });
        });
    });

    function downloadWitchCallback(file, callback) {
        var s = test_server.listen(function() {
            var base_url = 'http://localhost:'+ s.address().port;
            test_server.once('callback', callback);
            request(app)
                .post('/download?url='+ base_url +'/'+ file +'&callback='+ base_url +"/callback")
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                });
        });
    }

    it('should call the callback on finish', function(done) {
        downloadWitchCallback('test.mp3', function() {
            done();
        });
    });

    it('should store the file on the fs', function(done) {
        downloadWitchCallback('test.mp3', function(res) {
            fs.exists(__dirname + '/../data/test.mp3', function(exist) {
                if (exist) {
                    assert.equal(fs.readFileSync(__dirname +'/../data/test.mp3'), 'test');
                    done();
                }
                else done(exist);
            });
        });
    });

    it('should store the file based on the mp3 name', function(done) {
        downloadWitchCallback('New One.mp3', function(res) {
            fs.exists(__dirname + '/../data/New One.mp3', function(exist) {
                if (exist) done();
                else done(exist);
            });
        });
    });

    it('should don\'t fail with / in the filename', function(done) {
        downloadWitchCallback('roger/', function(res) {
            fs.exists(__dirname + '/../data/index', function(exist) {
                if (exist) done();
                else done(exist);
            });
        });
    });

    it('should extract the mp3 name from the Content-disposition header if available', function(done) {
        downloadWitchCallback('downloadattachment', function(req) {
            fs.exists(__dirname + '/../data/My Shiny mp3.mp3', function(exist) {
                if (exist) done();
                else done(exist);
            });
        });
    });

    it('should don\'t fail with / in the Content-Disposition filename', function(done) {
        downloadWitchCallback('baddownloadattachmentwithslash', function(req) {
            fs.exists(__dirname + '/../data/My Shiny mp3.mp3', function(exist) {
                if (exist) done();
                else done(exist);
            });
        });
    });

    it('should resist to bad Content-disposition header', function(done) {
        downloadWitchCallback('baddownloadattachment', function(req) {
            fs.exists(__dirname + '/../data/baddownloadattachment', function(exist) {
                if (exist) done();
                else done(exist);
            });
        });
    });

    it('should include the file download status on finish', function(done) {
        var s = test_server.listen(function() {
            var base_url = 'http://localhost:'+ s.address().port;
            var file_url = base_url +'/test.mp3';
            test_server.once('callback', function(req) {
                assert.equal(req.body.url, file_url);
                assert.equal(req.body.status, 200);
                assert.equal(req.body.size, 4);
                done();
            });
            request(app)
                .post('/download?url='+ file_url +'&callback='+ base_url +"/callback")
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                });
        });
    });

    it('should destroy the file if the server respond with an error', function(done) {
        downloadWitchCallback('404', function(req) {
            fs.exists(__dirname + '/../data/404', function(exist) {
                if (exist) done(false);
                else done();
            });
        });
    });
});
