var util = require('util')
  , im = require('imagemagick')
  , fs = require('fs')
  , path = require('path')
  , mime = require('mime')
  , cloudfiles = require('cloudfiles')
  , http  = require('http')
  , url   = require('url')
  , async = require('async')

var Imager = exports = module.exports = function Imager(config, storage) {

  if (config === undefined)
    throw new Error('Please provide the config')

  if (storage === undefined)
    throw new Error('Please specify the storage')

  if (config.storage[storage] === undefined)
    throw new Error('The storage you have specified does not exist in the config you have provided')

  this.config = config
  this.storage = storage
  this.uploadedFiles = []

  if (storage === 'Rackspace') this.setupCloudfiles()
}


Imager.prototype.upload = function (files, callback, variant) {
  var self = this

  if (typeof files !== 'string' && typeof files !== 'object')
    throw new Error('Please provide a valid file')

  if (typeof callback !== 'function')
    throw new Error('Please provide a callback')

  if (typeof variant !== 'string' && !this.config.variants.default)
    throw new Error('Please specify a proper variant OR provide a default variant in your imager config')

  if (typeof variant === 'string' && !this.config.variants[variant])
    throw new Error('Please provide a variant which you have specified in the config file')

  var processFiles = function (file, cb) {

    if (file.size) {
      var variants = self.config.variants[variant]

      // if none of resize or crop variant is defined, simply upload the image
      if (!Object.keys(variants).length)
        // simply upload the image

      if (variants.resize)
        self.resizeFile(file, variants.resize, cb)

      if (variants.crop)
        self.cropFile(file, variants.crop, cb)
    }
  }

  async.forEach(files, processFiles, function(err){

    // if any of the saves produced an error, err would equal that error
    if (err) return callback(err, null, null)
    callback(err, self.cdnUri, self.uploadedFiles)
  })

}


Imager.prototype.resizeFile = function (file, presets, cb) {
  var presetsArr = Object.keys(presets)
    , ct = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/gif': '.gif' }
    , fileType = ct[file['type']]
    , filename = Math.round(new Date().getTime()) + fileType

  var resize = function (preset, resizeCallback) {
    // preset : presets[preset]
    // mini   : 200x200

    var dest = '/tmp/' + preset + '_' + filename
    var options = {
        srcPath: file['path']
      , dstPath: dest
      , width: presets[preset].split('x')[0]
    }

    im.resize(options, function(err, stdout, stderr){
      if (err) return resizeCallback(err)
      self['pushTo' + self.storage](dest, filename, file['type'], resizeCallback)
    })
  }

  async.forEachSeries(presetsArr, resize, function (err) {
    if (err) return cb(err)
    cb(null)
  })
}


Imager.prototype.cropFile = function (file, presets, cb) {

  var presetsArr = Object.keys(presets)
    , ct = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/gif': '.gif' }
    , fileType = ct[file['type']]
    , filename = Math.round(new Date().getTime()) + fileType
    , self = this

  var crop = function (preset, cropCallback) {
    // preset : presets[preset]
    // mini   : 200x200

    var dest = '/tmp/' + preset + '_' + filename

    var options = {
        srcPath: file['path']
      , dstPath: dest
      , width: presets[preset].split('x')[0]
      , height: presets[preset].split('x')[1]
    }

    im.crop(options, function(err, stdout, stderr){
      if (err) return cropCallback(err)
      self['pushTo' + self.storage](dest, filename, file['type'], cropCallback)
    })
  }

  async.forEachSeries(presetsArr, crop, function (err) {
    if (err) return cb(err)
    cb(null)
  })
}


Imager.prototype.pushToRackspace = function (file, destFile, type, cb) {
  var self = this

  fs.readFile(file, function (err, buf) {
    if (err) return cb(err)

    var onUploadToContainer = function (err, uploaded) {
      if (err) return cb(err)
      if (uploaded) {
        console.log('uploaded')
        self.uploadedFiles.push(destFile)
        cb(null)
      }
    }

    var addFileToContainer = function (err, container) {
      if (err) return cb(err)
      var options = {
          remote: destFile
        , headers: {
              'Content-Type': type
            , 'Content-Length': buf.length
          }
        , local: file }

      self.cdnUri = container.cdnUri
      self.client.addFile(self.container, options, onUploadToContainer)
    }

    self.client.setAuth(function() {
      self.client.getContainer(self.container, true, addFileToContainer)
    })
  })
}


Imager.prototype.setupCloudfiles = function () {
  this.client = cloudfiles.createClient(this.config['storage'][this.storage])
  this.container = this.config['storage'][this.storage].container
}









