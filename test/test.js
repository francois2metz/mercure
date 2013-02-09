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

    it('should store the file on the fs', function(done) {
        var s = test_server.listen(function() {
            var base_url = 'http://localhost:'+ s.address().port;
            request(app)
                .post('/download?url='+ base_url +'/test.mp3')
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    fs.exists(__dirname + '/../data/test.mp3', function(exist) {
                        if (exist) done();
                        else done(exist);
                    });
                });
        });
    });

    it('should store the file based on the mp3 name', function(done) {
        var s = test_server.listen(function() {
            var base_url = 'http://localhost:'+ s.address().port;
            request(app)
                .post('/download?url='+ base_url +'/New One.mp3')
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    fs.exists(__dirname + '/../data/New One.mp3', function(exist) {
                        if (exist) done();
                        else done(exist);
                    });
                });
        });
    });

    it('should call the callback on finish', function(done) {
        var s = test_server.listen(function() {
            test_server.once('callback', function(){ done();});
            var base_url = 'http://localhost:'+ s.address().port;
            request(app)
                .post('/download?url='+ base_url +'/test.mp3&callback='+ base_url +"/callback")
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
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
});
