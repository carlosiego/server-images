const express = require('express')
const ProductsController = require('../controllers/ProductsController')
const ProductsRoutes = express.Router()

ProductsRoutes

	.post('/products', ProductsController.createProduct)
	.get('/products/:code', ProductsController.listProduct)
	.get('/products/codes/:codes', ProductsController.listProducts)
	.put('/products/:code', ProductsController.updateProduct)
	.delete('/products/:code', ProductsController.deleteProduct)

module.exports = ProductsRoutes
