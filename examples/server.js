
var express = require('express')
var app = express()
var config = require('./imager')
var Imager = require('../')

app.use(express.bodyParser())
app.post('/', function (req, res) {
  var imager = new Imager(config, 'S3') // 'Rackspace' or 'S3'
  imager.upload([req.files.image], function (err, cdnUri, uploaded) {
    if (err) return res.send(err.toString())
    res.send(JSON.stringify({
      cdnUri: cdnUri,
      uploaded: uploaded
    }))
  }, 'items')
})

app.get('/', function (req, res) {
  res.send('<html>' +
    '<body>' +
      '<form action="/" method="post" enctype="multipart/form-data">' +
        'Choose a file to upload <input type="file" name="image" />' +
        '<input type="submit" value="upload" />' +
      '</form>' +
    '</body>' +
  '</html>')
})

app.listen(3000)
console.log('Express app started on port 3000');
