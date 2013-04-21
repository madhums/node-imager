
/**
 * Module dependencies.
 */

var Imager = require('../')
  , should = require('should')
  , imagerConfig = require('./imager')
  , files = [__dirname+'/fixtures/single.jpg', __dirname+'/fixtures/multiple-3.png']

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

    describe('With local files', function () {
      it('should throw if the file paths are incorrect', function () {
        (function () {
          var imager = new Imager(imagerConfig, 'Rackspace')
          imager.upload(['abc.png'], 'items')
        }).should.throw('ENOENT, no such file or directory \'abc.png\'')
      })

      it('should throw with incorrect key/secret', function (done) {
        var imager = new Imager(imagerConfig, 'Rackspace')

        // unset the username
        imager.config.storage.Rackspace.auth.username = 'xyz123'

        imager.upload(files, function (err, cdnUri, uploaded) {
          should.exist(err)
          err.toString().should.equal('Error: Cannot make Rackspace request if not authorized')
          done()
        }, 'items')
      })

      it('should upload the images to the cloud', function (done) {
        var imager = new Imager(imagerConfig, 'Rackspace')
        imager.upload(files, function (err, cdnUri, uploaded) {
          // uncomment this to test
          // 1. make sure you substitute key/secret in ./imager.js
          // 2. uncomment the below lines

          /*
          should.not.exist(err)
          should.exist(cdnUri)
          uploaded.should.not.be.empty
          uploaded.should.have.lengthOf(2)
          */

          done()
        }, 'items')
      })
    })
  })
})






















