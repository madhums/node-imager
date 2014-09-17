[![Build Status](https://img.shields.io/travis/imagerjs/imager/master.svg?style=flat)](https://travis-ci.org/imagerjs/imager)
[![Gittip](https://img.shields.io/gratipay/madhums.svg?style=flat)](https://www.gratipay.com/madhums/)
[![Dependencies](https://img.shields.io/david/imagerjs/imager.svg?style=flat)](https://david-dm.org/imagerjs/imager)

**wip**: This is work in progress. Converting to use generators and [graphicsmagick-stream](https://github.com/e-conomic/graphicsmagick-stream) library. Everything is streamed.

## Imager

A node module to resize, crop and upload images (with different variants and presets) to Rackspace cloudfiles and Amazon S3.

## Requirements

You need to have [ImageMagick](http://www.imagemagick.org/) installed, otherwise you will get weird errors.

## Installation
```sh
$ npm install imager
```

## Usage
**You need to create imager configuration file with image variants and your storages**

Checkout the example config file `imager-config-example.js` in the repo

```js
var Imager = require('imager');
    // See https://github.com/madhums/node-imager/blob/master/imager-config-example.js for example configuration
  , imagerConfig = require('path/to/imager-config.js')
  , imager = new Imager(imagerConfig, 'Rackspace') // or 'S3' for amazon
```

### Uploading file(s)

The callback recieves an err object, a files array (containing the names of the files which were
uploaded) and the cdnUri.

So if you have a variant, say `thumb`, then you can access the image by `cdnUri+'/'+'thumb_'+files[0]`. This would be the complete url of the image

1. **Form upload (multiple images)**

  If you are using express, you will recieve all the form files in `req.files`.

  ```js
  imager.upload([req.files.image], function(err, cdnUri, files) {
      // do your stuff
  }, 'items')
  ```

  Here, `items` is your scope or variant. If you don't specify the scope or the variant, imager
  will try to look for a default variant named `default`. You must either specify a variant like
  above or provide a `default` variant.

  ONLY WORKS WITH S3
  If you add an uploadDirectory field to the imager config file as shown in imager-config-example.js, the files uploaded will go into that specific folder rather than the root of the bucket.
  If you leave out the uploadDirectory field, uploads will default to the root of the bucket.

2. **Upload local images**

  ```js
  imager.upload(['/path/to/file'], function (err, cdnUri, files) {
    // do your stuff
  }, 'items')
  ```

  Here files can be an array or a string. Make sure the path is
  absolute.

### Removing file(s)

```js
var files = ['1330838831049.png', '1330838831049.png']
imager.remove(files, function (err) {
  // do your stuff
}, 'items')
```

`files` can be array of filenames or a string of single filename.

Even here, if the variant is not specified, imager will try to look for the `default` variant. If neither
of them are provided, you will get an error.

### Gotchas

1. If your bucket name contains dot(s) make sure you set `secure: false`, otherwise
you will run into [this](https://github.com/LearnBoost/knox/issues/125).
2. Setting the `keepNames: true` for the variant retains the name of the uploaded file; otherwise you can set your custom rename function for each variant (check the example imager config)
3. If you specify `debug: true` in the imager config, you can see the logs of uploaded / removed files.
4. If you want to upload the original image, use

    ```
    resize: {
        original: "100%"
    }
    ```

## Tests

```sh
$ npm test
```

## License

MIT
