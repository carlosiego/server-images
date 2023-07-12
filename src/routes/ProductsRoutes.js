const express = require('express')
const ProductsController = require('../controllers/ProductsController')
const ProductsRoutes = express.Router()

ProductsRoutes

	.post('/products', ProductsController.createProduct)
	.get('/products/:code', ProductsController.listProduct)
	.put('/products/:code', ProductsController.updateProduct)

module.exports = ProductsRoutes
