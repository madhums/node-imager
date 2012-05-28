Imager
=============

A Node.js module to easily resize, crop and upload images to Rackspace cloudfiles. Possible to add different versions of the same file in cropped or resized variant.

## Installation
```sh
$ npm install imager
```

## Usage
**You need to create imager configuration file with image variants and your storages**

Checkout the example config file `imager-example.json` in the repo

```js
var  Imager = require('imager');
var imager = new Imager({storage : "rs", config_file: "path/to/imager_config.json"})
```
### UPLOAD FILE

1. Form upload

```js
imager.upload(req, function(err, files, cdnUri){
  // do your stuff
}, 'projects')
```

2. Upload files from disk

You can upload a single file or multiple files by providing the paths to all the files
in an array

Upload Single file from disk:
```js
imager.upload('path/to/file.jpg', function(err, files, cdnUri){
  // do your stuff
}, 'projects')
```

Upload multiple files from disk
```js
var files = ['file1.jpg', 'file2.jpg']
imager.upload(files, function(err, files, cdnUri){
  // do your stuff
}, 'projects')
```

3. Upload files from remote url
```js
imager.uploadRemoteImage('https://www.google.co.in/images/srpr/logo3w.png', function(err, files, cdnUri){
  // do your stuff
}, 'projects')
```

### REMOVE FILE

1. Remove a single file

```js
imager.remove('1330838831049.png', function (err) {
  if (err) throw err
  console.log('removed')
}, 'projects')
```

2. Remove multiple files

```js
var files = ['1330838831049.png', '1330838831049.png']
imager.remove(files, function (err) {
  // do your stuff
}, 'projects')
```

## To-do's
* Support amazon storage
* Support filesystem storage
* <strike>Remove using of `eval`</strike>
* <strike>Add functionality to remove files</strike>
* Write tests

### Many Thanks to [Alleup](https://github.com/tih-ra/alleup)
