const express = require('express')
const ProductsController = require('../controllers/ProductsController')
const ProductsRoutes = express.Router()

ProductsRoutes

	.post('/products', ProductsController.createProduct)


module.exports = ProductsRoutes
