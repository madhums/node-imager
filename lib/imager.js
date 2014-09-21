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
 * @param {Object} presets
 * @param {Object} storage
 * @api public
 */

function Imager (presets, storage) {
  if (!storage) {
    storage = presets;
    presets = {
      original: {
        original: true
      }
    };
  }
  this.client = pkgcloud.storage.createClient(storage);
  this.presets = presets;
  this.container = storage.container;
}

/**
 * upload
 *
 * @param {Array|String} files
 * @param {Function} fn
 * @api public
 */

Imager.prototype.upload = function (files, fn) {
  var self = this;
  var presets = self.presets;
  if (typeof files === 'string') files = [files];

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
      // group by preset
      var hash = {};
      for (var i = 0; i < uploaded.length; i++) {
        var key = uploaded[i].preset;
        if (!hash[key]) hash[key] = [];
        hash[key].push(uploaded[i].url);
      }
      fn(null, hash);
    } catch (err) {
      fn(err);
    }
  })();
};

/**
 * remove
 *
 * @param {Array|String} files
 * @param {Function} fn
 * @api public
 */

Imager.prototype.remove = function (files, fn) {
  var self = this;
  if (typeof files === 'string') files = [files];

  co(function *() {
    try {
      yield files.map(remove.bind(self));
      fn(null);
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
  var filename = preset.rename && preset.rename(file);

  return function (fn) {
    var _convert = gm(preset.options);
    var _upload = client.upload({
      container: container,
      remote: filename || (preset.__name + '_' + file.name)
    }, done);

    function done (err, uploaded, res) {
      if (err) return fn(err);
      fn(err, {
        preset: preset.__name,
        url: res.request.href
      });
    }

    var stream = fs.createReadStream(file.path);
    if (!preset.original) stream = stream.pipe(_convert());
    stream.pipe(_upload);
  };
}

/**
 * remove
 *
 * @param {Object} file
 * @api private
 */

function remove (file) {
  var self = this;
  return function (fn) {
    self.client.removeFile(self.container, file, fn);
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
      : file.originalname || file.name,
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
