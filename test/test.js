var Imager = require('../index')
  , should = require('should')
  , imager = new Imager({storage : "rs", config_file: __dirname+"/imager.json"})

describe('Imager', function () {
  describe('Single image from disk', function () {
    it('should upload to rackspace', function (done) {
      imager.upload(__dirname+'/fixtures/single.jpg', function(err, files, cdnUri){
        files.should.be.a('object')
        files.length.should.be.equal(1)
        console.log(files)
        done()
      }, 'items')
    })
  })

  describe('Multiple images from disk', function () {
    it('should upload to rackspace', function (done) {
      var arr = [__dirname+'/fixtures/single.jpg', __dirname+'/fixtures/multiple-3.png']
      imager.upload(arr, function(err, files, cdnUri){
        files.should.be.a('object')
        files.length.should.be.equal(2)
        console.log(files)
        done()
      }, 'items')
    })
  })

  describe('Single image from remote url', function () {
    it('should upload to rackspace', function (done) {
      imager.uploadRemoteImage('http://www.google.co.in/images/srpr/logo3w.png', function(err, files, cdnUri){
        files.should.be.a('object')
        files.length.should.be.equal(1)
        console.log(files)
        done()
      }, 'items')
    })
  })
})
