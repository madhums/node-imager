
/**
 * Module dependencies.
 */

var Imager = require('../');
var should = require('should');
var co = require('co');
var config = require('./imager');
var files = [
  __dirname+'/fixtures/single.jpg',
  __dirname+'/fixtures/multiple-3.png'
];

describe('Imager', function () {
  it('should run', function (done) {
    var imager = new Imager(config.variants, config.storages.amazon);
    imager.upload(files, 'item', function (err, _files) {
      console.log(_files);
      done(err);
    });
  });
});
