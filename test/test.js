
/**
 * Module dependencies.
 */

var Imager = require('..');
var should = require('should');
var co = require('co');
var config = require('./imager');
var files = [
  __dirname + '/fixtures/image-1.png',
  __dirname + '/fixtures/image-2.jpg'
];

describe('imager.upload', function () {
  it('should upload and return the uploaded files', function (done) {
    var imager = new Imager(config.variants.item, config.storages.amazon);
    imager.upload(files, function (err, _files) {
      should.not.exist(err);
      _files.should.be.instanceOf(Array);
      _files.should.have.lengthOf(4);
      done(err);
    });
  });

  it('should obey preset.rename and rename the remote files', function (done) {
    config.variants.item.thumb.rename = function (file) {
      return 'user/1/thumb/' + file.name;
    };
    var imager = new Imager(config.variants.item, config.storages.amazon);
    imager.upload(files, function (err, _files) {
      should.not.exist(err);
      _files.should.be.instanceOf(Array);
      _files.should.have.lengthOf(4);
      _files.should.containDeep([
        'https://'+ config.storages.amazon.container +'.s3.amazonaws.com/user/1/thumb/image-1.png',
        'https://'+ config.storages.amazon.container +'.s3.amazonaws.com/user/1/thumb/image-2.jpg'
      ])
      done(err);
    });
  });
});
