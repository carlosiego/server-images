require('dotenv').config()
require('express-async-errors')

const express = require('express')
const routes = require('./routes/index.js')
const path = require('path')
const app = express()
const limiter = require('./rateLimit')
const compression = require('compression')
app.use('/files', express.static(path.resolve(__dirname, "..", "uploads")))

app.use(express.json())

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(limiter)
app.use(compression())
routes(app)

app.use((error, req, res, next) => {
  console.log('============= ERROR HANDLER =============')
  console.log(error)
  res.sendStatus(500)
})

app.listen(process.env.PORT, () => {
  console.log(`Servidor escutando em http://${process.env.SERVER_ADDRESS}:${process.env.PORT}`)
})
