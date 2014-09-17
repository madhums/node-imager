'use strict';

/*!
 * imager
 * Copyright(c) 2014 Madhusudhan Srinivasa <madhums8@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var fs = require('fs');
var gm = require('graphicsmagick-stream');
var mime = require('mime');
var co = require('co');
var pkgcloud = require('pkgcloud');
var debug = require('debug')('imager');

/**
 * Expose
 */

module.exports = Imager;

/**
 * Imager
 *
 * @param {Object} variants
 * @param {Object} storage
 * @api public
 */

function Imager (variants, storage) {
  this.client = pkgcloud.storage.createClient(storage);
  this.variants = variants;
  this.container = storage.container;
}

/**
 * upload
 *
 * @param {Array|String} files
 * @@param {String} variant
 * @param {Function} cb
 * @api public
 */

Imager.prototype.upload = function (files, variant, fn) {
  var self = this;

  if (typeof files === 'string') {
    files = [files];
  }

  var presets = self.variants[variant];
  presets = Object.keys(presets).map(function (key) {
    presets[key].__name = key;
    return presets[key];
  });

  co(function *() {
    // modified files having the same object structure
    var _files = yield files.map(info);
    var arr = [];

    _files.forEach(function (file) {
      presets.forEach(function (preset) {
        arr.push({ file: file, preset: preset });
      });
    });

    try {
      var uploaded = yield arr.map(upload.bind(self));
      fn(null, uploaded);
    } catch (err) {
      fn(err);
    }
  })();
};

/**
 * upload
 *
 * @param {Object} file
 * @api private
 */

function upload (obj) {
  var container = this.container;
  var client = this.client;
  var preset = obj.preset;
  var file = obj.file;
  var filename = preset.rename && preset.rename(file, preset.__name);

  return function (fn) {
    var _convert = gm(preset.options);
    var _upload = client.upload({
      container: container,
      remote: filename || (preset.__name + '_' + file.name)
    }, done);

    function done (err, uploaded, res) {
      if (err) return fn(err);
      // uploaded image url
      fn(err, res.request.href);
    }

    // convert and upload
    fs.createReadStream(file.path)
      .pipe(_convert())
      .pipe(_upload);
  };
}

/**
 * info
 *
 * @param {Object} file
 * @return {Object}
 * @api private
 */

function *info (file) {
  return {
    size: typeof(file) === 'string'
      ? (yield stat(file)).size
      : file.size,
    type: typeof(file) === 'string'
      ? mime.lookup(file)
      : mime.lookup(file.path),
    name: typeof(file) === 'string'
      ? file.split('/')[file.split('/').length - 1]
      : file.name,
    path: typeof(file) === 'string'
      ? file
      : file.path
  };
}

/**
 * stat
 *
 * @param {String} path
 * @return {Function}
 * @api private
 */

function stat (path) {
  return function (done) {
    fs.stat(path, done);
  };
}
