var Imager = require('../index')
  , should = require('should')
  , imagerConfig = require('./imager')
  , imager = new Imager(imagerConfig, 'Rackspace')
  , filesToRemove

describe('Imager', function () {
  describe('Single image from disk', function () {
    it('should upload to rackspace', function (done) {
      imager = new Imager(imagerConfig, 'Rackspace')
      imager.upload(__dirname+'/fixtures/single.jpg', function(err, cdnUri, files){
        files.should.be.a('object')
        files.length.should.be.equal(1)
        done()
      }, 'items')
    })
  })

  describe('Multiple images from disk', function () {
    it('should upload to rackspace', function (done) {
      var arr = [__dirname+'/fixtures/single.jpg', __dirname+'/fixtures/multiple-3.png']
      imager = new Imager(imagerConfig, 'Rackspace')
      imager.upload(arr, function(err, cdnUri, files){
        files.should.be.a('object')
        files.length.should.be.equal(2)
        filesToRemove = files
        done()
      }, 'items')
    })
  })

  describe('Remove images', function () {
    it('should remove the images from Rackspace', function (done) {
      imager = new Imager(imagerConfig, 'Rackspace')
      imager.remove(filesToRemove, function(err){
        should.not.exist(err)
        done()
      }, 'items')
    })
  })
})
