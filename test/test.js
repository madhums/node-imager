
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
    imager.upload(files, function (err, uploaded) {
      should.not.exist(err);
      uploaded.should.be.instanceOf(Object);
      uploaded.should.have.property('thumb')
      uploaded.thumb.should.be.instanceOf(Array);
      uploaded.thumb.should.have.lengthOf(2);
      uploaded.should.have.property('large')
      uploaded.large.should.be.instanceOf(Array);
      uploaded.large.should.have.lengthOf(2);
      done(err);
    });
  });

  it('should obey preset.rename and rename the remote files', function (done) {
    config.variants.item.thumb.rename = function (file) {
      return 'user/1/thumb/' + file.name;
    };
    var imager = new Imager(config.variants.item, config.storages.amazon);
    imager.upload(files, function (err, uploaded) {
      should.not.exist(err);
      uploaded.thumb.should.containDeep([
        'https://'+ config.storages.amazon.container +'.s3.amazonaws.com/user/1/thumb/image-1.png',
        'https://'+ config.storages.amazon.container +'.s3.amazonaws.com/user/1/thumb/image-2.jpg'
      ])
      done(err);
    });
  });
});
