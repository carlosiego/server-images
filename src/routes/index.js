const express = require('express')
const imagesProductsRoutes = require('./imagesProductsRoutes')
const imagesLocationsRoutes = require('./imagesLocationsRoutes')

const routes = (app) => {
    app.use(
        express.json(),
        imagesProductsRoutes,
        imagesLocationsRoutes
    )
}

module.exports = routes