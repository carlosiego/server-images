const express = require('express')
const ImgProductsRoutes = require('./ImgProductsRoutes')
// const ImgLocationsRoutes = require('./ImgLocationsRoutes')
const ProductsRoutes = require('./ProductsRoutes')

const routes = (app) => {
	app.use(
		express.json(),
		ImgProductsRoutes,
		ProductsRoutes
	)
}

module.exports = routes
