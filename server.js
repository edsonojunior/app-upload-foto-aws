//Install express server
const express = require('express')
const path = require('path')
const port = process.env.PORT || 3000
const app = express()
//const http = express.createServer();

// http.get('*', function (req, res) {
//     res.redirect('https://' + req.headers.host + req.url);
// })

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/upload-photo-aws'));
//app.use(express.static(path.join(__dirname, 'dist', 'guardpv-web')))

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/upload-photo-aws/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(port)
