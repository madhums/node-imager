
/**
 * Module dependencies.
 */

var Imager = require('../')
  , should = require('should')
  , imagerConfig = require('./imager')

describe('new Imager()', function () {
  it('should throw if no parameters are passed', function () {
    (function () {
      var imager = new Imager()
    }).should.throw('Please provide the config')
  })

  it('should throw if no config is provided', function () {
    (function () {
      var imager = new Imager('Rackspace')
    }).should.throw('Please provide the config')
  })

  it('should throw if config is null or undefined', function () {
    (function () {
      var imager = new Imager(null, 'Rackspace')
    }).should.throw('Please provide the config')
  })

  it('should throw if config doesnt have storage', function () {
    (function () {
      var imager = new Imager({}, 'Rackspace')
    }).should.throw('Please specify a storage')
  })

  it('given proper config - should create the instance', function () {
    var imager = new Imager(imagerConfig, 'Rackspace')

    imager.config.should.have.property('variants')
    imager.config.should.have.property('storage')
    should.strictEqual('Rackspace', imager.storage)
    imager.uploadedFiles.should.be.empty
  })
})

describe('Imager', function () {
  describe('#upload()', function () {
    it('should throw if no variant is provided', function () {
      (function () {
        var imager = new Imager(imagerConfig, 'Rackspace')
        imager.upload()
      }).should.throw('Please specify a proper variant OR provide a default')
    })

    it('should throw if the variant is not in the config', function () {
      (function () {
        var imager = new Imager(imagerConfig, 'Rackspace')
        imager.upload([], 'abc')
      }).should.throw('Please provide a variant which you have specified in the config file')
    })

    it('should do nothing if the files are not provided', function (done) {
      var imager = new Imager(imagerConfig, 'Rackspace')
      imager.upload([], function (err, cdnUri, files) {
        should.not.exist(err)
        should.not.exist(cdnUri)
        files.should.be.empty
        done()
      }, 'items')
    })

  })
})






















