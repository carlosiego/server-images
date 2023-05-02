require('dotenv').config()
const express = require('express')
const routes = require('./src/routes/index.js')
const path = require('path')
const app = express()
 
app.use('/files', express.static(path.resolve(__dirname, "public", "upload")))

app.use(express.json())

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-PINGOTHER, X-Requested-With, Content-Type, Accept");
    next();
});

routes(app)

module.exports = app