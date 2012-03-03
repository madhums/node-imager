Imager
=============

Flexible way to resize and upload images to Rackspace cloudfiles for Node.js. Possible to add different versions of the same file in cropped or resized variant.

## Installation
    $ npm install imager

## Usage

**You need to create imager configuration file with image variants and your storages**

Example config with scopes:

    ```javascript
    {
		"variants": {
			"projects": { //projects is scope
			  "resize": {
				  "mini" : "300x200",
				  "preview": "800x600"
			  },
			  "crop": {
				 "thumb": "200x200"
			  }
			},

			"gallery": { //gallery is scope
			   "crop": {
				"thumb": "100x100"
			   }
			}
		},

		"storage": {
			"aws": {
				"key" : "AWS_KEY",
				"secret" : "AWS_SECRET",
				"bucket" : "AWS_BUCKET"
			},
			"dir": {
				"path" : "./public/images/"
			}
		}
	}

2. **Now you can use Imager**

    ```javascript
    var  Imager = require('alleup');
    var imager = new Imager({storage : "rs", config_file: "path_to_imager_config.json"})

  More storage systems yet to come

## UPLOAD

**Upload example:**

    ```javascript

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
     alleup.upload(req, res, function(err, file, cdnUri, res){

         console.log("FILE UPLOADED: " + cdnUri+'/'+file);
         // THIS YOU CAN SAVE FILE TO DATABASE FOR EXAMPLE
         res.end();
     }, 'projects');

    });

### Contributions
**Thanks to [Alleup](https://github.com/tih-ra/alleup)**
**Pull requests are welcome!!!**

### To-do's
* Support amazon storage
* Support filesystem storage
* Remove using of `eval`
* add remove file functionality
* add functionality to get the image url's
* write tests

### License
(The MIT License)

Copyright (c) 2012 Madhusudhan Srinivasa &lt;madhums8@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---
### Author
Madhusudhan Srinivasa
