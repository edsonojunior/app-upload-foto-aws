//Install express server
const express = require('express')
const path = require('path')
const port = process.env.PORT || 3000
const app = express()

app.use(express.static(__dirname + '/dist/upload-photo-aws'));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/upload-photo-aws/index.html'));
});

app.listen(port)
