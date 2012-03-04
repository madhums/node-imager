Imager
=============

A Node.js module to easily resize, crop and upload images to Rackspace cloudfiles. Possible to add different versions of the same file in cropped or resized variant.

## Installation
    $ npm install imager

## Usage

**You need to create imager configuration file with image variants and your storages**

Example config with scopes:

```js
{
  "variants": {
    "projects": {
      "resize": {
        "mini" : "300x200",
        "preview": "800x600"
      },
      "crop": {
        "thumb": "200x200"
      }
    },

    "gallery": {
      "crop": {
        "thumb": "100x100"
      }
    }
  },

  "storage": {
    "rs": {
      "auth": {
        "username": "USERNAME",
        "apiKey": "API_KEY",
        "host": "lon.auth.api.rackspacecloud.com"
      },
      "container": "CONTAINER_NAME"
    }
  }
}
```
**Now you can use Imager**

```js
var  Imager = require('imager');
var imager = new Imager({storage : "rs", config_file: "path_to_imager_config.json"})
```
**Note:** More storage systems yet to come

## UPLOAD FILE

**Upload example:**

```js
app.get('/upload_form', function(req, res) {
  res.writeHead(200, {'content-type': 'text/html'});
  res.end(
    '<form action="/upload_form" enctype="multipart/form-data" method="post">'+
    '<input type="text" name="title"><br>'+
    '<input type="file" name="image"><br>'+
    '<input type="submit" value="Upload">'+
    '</form>'
  );
});

app.post('/upload',  function(req, res) {
  //With Scope `items` (look at example of configuration file)
  imager.upload(req, res, function(err, files, cdnUri, res){
    console.log({ uri : cdnUri, files : files });
    res.end()
  }, 'items')
});
```

## REMOVE FILE

```js
imager.remove('1330838831049.png', function (err) {
  if (err) throw err
  console.log('removed')
}, 'projects')
```

## To-do's
* Support amazon storage
* Support filesystem storage
* <strike>Remove using of `eval`</strike>
* Add functionality to remove files
* Add functionality to get the image url
* Add functionality to get remote images, process the image and then upload to various storage systems
* Write tests

### Many Thanks to [Alleup](https://github.com/tih-ra/alleup)
