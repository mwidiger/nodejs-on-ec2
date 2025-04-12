var fs = require ('fs');
var http = require('http');
var https = require('https');
var privateKey = fs.readFileSync('key.pem');
var certificate = fs.readFileSync('cert.pem');

var credentials = {key: privateKey, cert: certificate};
var express = require('express');
var app = express();

app.get('/', (req, res) => {
  res.send('Hello World!')
})

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

app.use(function(req, res, next) {
  res.redirect('https://' + req.headers.host + req.url);
  next();
});

httpServer.listen(80);

httpsServer.listen(443, () => {
  console.log('HTTP Server running on port 80');
});
