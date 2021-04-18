const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const userApi = require('./api/userApi.js');
const confession = require('./api/article.js');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.use('/api', userApi, confession);
module.exports = app;

app.listen(8090, function() {
  console.log('Server Running...');
});