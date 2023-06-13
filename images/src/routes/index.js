const express = require('express')
const ProductsRoutes = require('./ProductsRoutes')
const LocationsRoutes = require('./LocationsRoutes')

const routes = (app) => {
    app.use(
        express.json(),
        ProductsRoutes,
        LocationsRoutes
    )
}

module.exports = routes