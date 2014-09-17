[![Build Status](https://img.shields.io/travis/imagerjs/imager/master.svg?style=flat)](https://travis-ci.org/imagerjs/imager)
[![Gittip](https://img.shields.io/gratipay/madhums.svg?style=flat)](https://www.gratipay.com/madhums/)
[![Dependencies](https://img.shields.io/david/imagerjs/imager.svg?style=flat)](https://david-dm.org/imagerjs/imager)

**wip**: This is work in progress. Converting to use generators and [graphicsmagick-stream](https://github.com/e-conomic/graphicsmagick-stream) library. The uploading is handled by [pkgcloud](https://github.com/pkgcloud/pkgcloud).

## Imager

A node module to resize, crop and upload images (with different variants and presets) to the cloud.

## Dependencies

1. node >= 0.11.12 with `--harmony` flag
2. You need to install libgraphicsmagicks.

  Using osx

  ```sh
  $ brew install graphicsmagick --build-from-source
  ```

  Using ubuntu

  ```sh
  $ sudo apt-get install libgraphicsmagick1-dev
  ```

## Installation

```sh
$ npm install imager
```

## API

### config

```js
exports.variants = {
  item: {             // variant
    thumb: {          // preset
      options: {      // preset options
        pool: 5,
        scale: { width: 200, height: 150, type: 'contain' },
        crop: { width: 200, height: 150, x: 0, y: 0 },
        format: 'png',
        rotate: 'auto',
      }
    },
    large: {
      options: {
        scale: { width: 400, height: 300 }
      }
    }
  },
  gallery: {
    // ...
  }
};
```

In the above config, item and gallery are variants. thumb and large are presets. Each preset has an options object which is a [graphicsmagick-stream](https://github.com/e-conomic/graphicsmagick-stream#usage) config object.

A preset also accepts a `rename` function, which is called before uploading each file.

```js
variants.item.thumb.rename = function (file) {
  return 'users/1/thumb/' + file.name;
};
var imager = new Imager(variants.item, ...);
```

### .upload(files, callback)

`files` is an array of files or a single file. A file can be a file object, absolute file path pointing a local file or base64 encoded image data. `callback` accepts `err` and an object containing the array of uploaded images.

```js
var config = require('./imager-config.js');
var imager = new Imager(config.variants.item, config.storage);
imager.upload(files, function (err, avatar) {
  // avatar =>
  // {
  //   thumb: [ 'https://fudge.s3.amazonaws.com/user/1/thumb/image-1.png', ],
  //   large: [ 'https://fudge.s3.amazonaws.com/user/1/large/image-1.png', ]
  // }
});
```

### .remove()
### .regenerate()

## Tests

```sh
$ npm test
```

## License

MIT
