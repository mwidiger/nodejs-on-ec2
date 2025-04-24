var fs = require ('fs');
var http = require('http');
var https = require('https');

// Start database connection
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  'scorecard_development',
  'postgres',
  'postgres',
  {
    host: 'localhost',
    dialect: 'postgres'
  }
);

// Test database connection
sequelize.authenticate().then(() => {
  console.log('Database connection has been established successfully.');
}).catch((error) => {
  console.error('Unable to connect to the database:', err);
});

// Start up express
const express = require('express');
const router = express.Router();
var app = express();

// Controllers
const apiController = require('./controllers/apiController')

app.use('/api', apiController);

app.get('/api/v1/scorecards', (req, res) => {
  res.send('Hello World!')
})

app.listen(5000, () => {
  console.log('Server running on port 5000');
});

// https redirection
//var privateKey = fs.readFileSync('key.pem');
//var certificate = fs.readFileSync('cert.pem');
//var credentials = {key: privateKey, cert: certificate};

//var httpServer = http.createServer(app);
//var httpsServer = https.createServer(credentials, app);


//app.use(function(req, res, next) {
//  res.redirect('https://' + req.headers.host + req.url);
//  next();
//});

//httpServer.listen(80);
//
//httpsServer.listen(443, () => {
//  console.log('HTTP Server running on port 80');
//});
