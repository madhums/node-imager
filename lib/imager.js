var gm = require('gm').subClass({ imageMagick: true })
  , fs = require('fs')
  , path = require('path')
  , mime = require('mime')
  , cloudfiles = require('cloudfiles')
  , knox = require('knox')
  , async = require('async')
  , _ = require('underscore')

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
}


Imager.prototype.upload = function (files, callback, variant) {
  var self = this
    , getFileInfo = function (file, cb) {
        var f = {
            size: fs.statSync(file).size
          , type: mime.lookup(file)
          , name: file.split('/')[file.split('/').length - 1]
          , path: file
        }
        file = f
        cb(null, file)
      }

  // to check if the files are local
  if (Array.isArray(files) && typeof files[0] === 'string') {
    async.map(files, getFileInfo, function (err, result) {
      files = result
    })
  }
  else if (!Array.isArray(files) && typeof files === 'string') {
    files = files.split()
    async.map(files, getFileInfo, function (err, result) {
      files = result
    })
  }

  if (typeof callback !== 'function')
    throw new Error('Please provide a callback')

  if (typeof variant !== 'string' && !this.config.variants.default)
    throw new Error('Please specify a proper variant OR provide a default variant in your imager config')

  if (!variant && this.config.variants.default)
    var variant = 'default'

  if (typeof variant === 'string' && !this.config.variants[variant])
    throw new Error('Please provide a variant which you have specified in the config file')

  var startUpload = function (file, iteratorCallback) {
    var filename = Math.round(new Date().getTime())
    self.startUpload(file, filename, variant, iteratorCallback)
  }

  async.forEach(files, startUpload, function (err) {
    if (err) return callback(err)
    callback(null, self.cdnUri, self.uploadedFiles)
  })
}


Imager.prototype.startUpload = function (file, filename, variant, iteratorCallback) {
  if (!file.size) return iteratorCallback();

  var variants = this.config.variants[variant]
    , asyncArr = []
    , self = this

  if (variants.resize) {
    Object.keys(variants.resize).forEach(function (name) {
      var processFiles = function (cb) {
        self.resizeFile(file, { name: name, size: variants.resize[name] }, filename, cb)
      }
      asyncArr.push(processFiles)
    })
  }

  if (variants.crop) {
    Object.keys(variants.crop).forEach(function (name) {
      var processFiles = function (cb) {
        self.cropFile(file, { name: name, size: variants.crop[name] }, filename, cb)
      }
      asyncArr.push(processFiles)
    })
  }

  if (variants.resizeAndCrop) {
    Object.keys(variants.resizeAndCrop).forEach(function (name) {
      var processFiles = function (cb) {
        self.resizeAndCropFile(file, { name: name, type: variants.resizeAndCrop[name] }, filename, cb)
      }
      asyncArr.push(processFiles)
    })
  }

  async.parallel(asyncArr, function (err, results) {
    if (err) console.log(err)
    var f = _.uniq(results).toString()

    f = f.indexOf(',') === -1 ? f : f.slice(0, f.length - 1)

    self.uploadedFiles.push(f)
    if (self.config.debug) console.log(self.uploadedFiles)
    iteratorCallback(err)
  })
}


Imager.prototype.resizeFile = function (file, preset, fname, cb) {
  var ct = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/gif': '.gif' }
    , fileType = ct[file['type']]
    , filename = fname + fileType
    , self = this

  var remoteFile = preset.name + '_' + filename
    , dest = '/tmp/' + remoteFile

  gm(file['path'])
    .autoOrient()
    .resize(preset.size.split('x')[0], preset.size.split('x')[1])
    .write(dest, function(err) {
      if (err) return cb(err)
      self['pushTo' + self.storage](dest, remoteFile, filename, file['type'], cb)
    }
  )
}


Imager.prototype.cropFile = function (file, preset, fname, cb) {
  var ct = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/gif': '.gif' }
    , fileType = ct[file['type']]
    , filename = fname + fileType
    , self = this

  var remoteFile = preset.name + '_' + filename
    , dest = '/tmp/' + remoteFile

  gm(file['path'])
    .autoOrient()
    .crop(preset.size.split('x')[0], preset.size.split('x')[1])
    .write(dest, function(err) {
      if (err) return cb(err)
      self['pushTo' + self.storage](dest, remoteFile, filename, file['type'], cb)
    }
  )
}


Imager.prototype.resizeAndCropFile = function (file, preset, fname, cb) {
  var ct = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/gif': '.gif' }
    , fileType = ct[file['type']]
    , filename = fname + fileType
    , self = this

  var remoteFile = preset.name + '_' + filename
    , dest = '/tmp/' + remoteFile

  gm(file['path'])
    .autoOrient()
    .resize(preset.type.resize.split('x')[0], preset.type.resize.split('x')[1])
    .gravity('Center')
    .crop(preset.type.crop.split('x')[0], preset.type.crop.split('x')[1])
    .write(dest, function(err) {
      if (err) return cb(err)
      self['pushTo' + self.storage](dest, remoteFile, filename, file['type'], cb)
    }
  )
}


Imager.prototype.pushToRackspace = function (file, remoteFile, filename, type, cb) {
  var self = this
    , client = cloudfiles.createClient(this.config['storage'][this.storage])
    , rsContainer = this.config['storage'][this.storage].container

  fs.readFile(file, function (err, buf) {
    if (err) return cb(err)

    var onUploadToContainer = function (err, uploaded) {
      if (err) return cb(err)
      if (uploaded) {
        if (self.config.debug) console.log(remoteFile + ' uploaded')
        cb(null, filename)
      }
    }

    var addFileToContainer = function (err, container) {
      if (err) return cb(err)
      var options = {
          remote: remoteFile
        , headers: {
              'Content-Type': type
            , 'Content-Length': buf.length
          }
        , local: file }

      self.cdnUri = container.cdnUri
      client.addFile(rsContainer, options, onUploadToContainer)
    }

    client.setAuth(function() {
      client.getContainer(rsContainer, true, addFileToContainer)
    })
  })
}


Imager.prototype.pushToS3 = function (file, remoteFile, filename, type, cb) {
  var self = this
    , client = knox.createClient(this.config['storage'][this.storage])

  client.putFile(file, remoteFile, function (err, res) {
    if (err) return cb(err)
    if (self.config.debug) console.log(remoteFile + ' uploaded')
    self.cdnUri = 'http://' + client.endpoint
    cb(err, filename)
  })
}


Imager.prototype.remove = function (files, callback, variant) {
  if (!variant && !this.config.variants.default)
    throw new Error('Please specify a proper variant to remove the files')

  if (!variant && this.config.variants.default)
    var variant = 'default'

  var self = this

  if (!Array.isArray(files) && typeof files === 'string')
    files = files.split()

  var prepareRemove = function (file, iteratorCallback) {
    self.prepareRemove(file, iteratorCallback, variant)
  }

  async.forEach(files, prepareRemove, function (err) {
    if (err) return callback(err)
    callback(null)
  })
}


Imager.prototype.prepareRemove = function (file, iteratorCallback, variant) {
  var variants = this.config.variants[variant]
    , asyncArr = []
    , self = this

  if (variants.resize) {
    Object.keys(variants.resize).forEach(function (preset) {
      var removeFiles = function (cb) {
        self['removeFrom' + self.storage](file, preset, cb)
      }

      asyncArr.push(removeFiles)
    })
  }

  if (variants.crop) {
    Object.keys(variants.crop).forEach(function (preset) {
      var removeFiles = function (cb) {
        self['removeFrom' + self.storage](file, preset, cb)
      }

      asyncArr.push(removeFiles)
    })
  }

  if (variants.resizeAndCrop) {
    Object.keys(variants.resizeAndCrop).forEach(function (preset) {
      var removeFiles = function (cb) {
        self['removeFrom' + self.storage](file, preset, cb)
      }

      asyncArr.push(removeFiles)
    })
  }

  async.parallel(asyncArr, function (err, results) {
    iteratorCallback(err)
  })
}


Imager.prototype.removeFromRackspace = function (file, preset, cb) {
  var self = this
    , client = cloudfiles.createClient(this.config['storage'][this.storage])
    , rsContainer = this.config['storage'][this.storage].container
    , remoteFile = preset + '_' + file

  client.setAuth(function() {
    client.getContainer(rsContainer, true, function (err, container) {
      if (err) return callback(err)

      container.removeFile(remoteFile, function(err){
        if (self.config.debug) console.log(remoteFile + ' removed')
        if (err) console.log(err)
        cb(err)
      })
    })
  })
}


Imager.prototype.removeFromS3 = function (file, preset, cb) {
  var self = this
    , client = knox.createClient(this.config['storage'][this.storage])
    , remoteFile = preset + '_' + file

  client.deleteFile(remoteFile, function(err, res){
    if (self.config.debug) console.log(remoteFile + ' removed')
    if (err) console.log(err)
    cb(err)
  })
}
