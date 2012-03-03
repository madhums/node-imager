Imager
=============

Flexible way to resize and upload images to Rackspace cloudfiles for Node.js. Possible to add different versions of the same file in cropped or resized variant.

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

## UPLOAD

**Upload example:**

```js
app.get('/upload_form', function(req, res) {
  res.writeHead(200, {'content-type': 'text/html'});
    res.end(
      '<form action="/upload" enctype="multipart/form-data" method="post">'+
        '<input type="text" name="title"><br>'+
        '<input type="file" name="upload" multiple="multiple"><br>'+
        '<input type="submit" value="Upload">'+
      '</form>'
    );
});

app.post('/upload',  function(req, res) {
  //With Scope `projects` (look at example of configuration file)
  imager.upload(req, res, function(err, file, cdnUri, res){
    console.log("FILE UPLOADED: " + cdnUri+'/'+file);
    // THIS YOU CAN SAVE FILE TO DATABASE FOR EXAMPLE
    res.end();
  }, 'projects');
});
```

## To-do's
* Support amazon storage
* Support filesystem storage
* Remove using of `eval`
* Add functionality to remove files
* Add functionality to get the image url
* Add functionality to get remote images, process the image and then upload to various storage systems
* Write tests

### Many Thanks to [Alleup](https://github.com/tih-ra/alleup)
