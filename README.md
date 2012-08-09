Imager
=============

A Node.js module to easily resize, crop and upload images (with different variants and presets) to Rackspace cloudfiles.

## Installation
```sh
$ npm install imager
```

**Note** : _Uptil v0.0.8 the module supported filesystem uploads and external (remote) image uploads, but the module was completely re-written
to use async and make it much faster. The 0.0.9 version of the module doesn't support file system uploads.
I will try to add it back soon. You can revert back to older versions if you need filesystem support etc_

## Usage
**You need to create imager configuration file with image variants and your storages**

Checkout the example config file `imager-example.js` in the repo

```js
var Imager = require('imager');
  , imagerConfig = require('path/to/imager-config.js')
  , imager = new Imager(imagerConfig, 'Rackspace')
```

### Uploading file(s)

The callback recieves an err object, a files array (containing the names of the files which were
uploaded) and the cdnUri.

So if you have a variant, say `thumb`, then you can access the image by `cdnUri+'/'+'thumb_'+files[0]`. This would be the complete url of the image

1. **Form upload (multiple images)**

  If you are using express, you will recieve all the form files in `req.files`.

  ```js
  imager.upload(req.files.image, function(err, cdnUri, files) {
      // do your stuff
  }, 'projects')
  ```

  Here, `projects` is your scope or variant. If you don't specify the scope or the variant, imager
  will try to look for a default variant named `default`. You must either specify a variant like
  above or provide a `default` variant.


### Removing file(s)

1. **Remove from cloudfiles**

  ```js
  var files = ['1330838831049.png', '1330838831049.png']
  imager.remove(files, function (err) {
      // do your stuff
  }, 'projects')
  ```

  Even here, if the variant is not specified, imager will try to look for the `default` variant. If neither
  of them are provided, you will get an error.

## Debugging
If you specify `debug: true` in the imager config, you can see the logs of uploaded / removed files.

## To-do's
* Support amazon storage
* Support filesystem storage
* Write tests


**credits :** Initially inspired by [Alleup](https://github.com/tih-ra/alleup)
