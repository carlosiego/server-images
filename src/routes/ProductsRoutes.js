const express = require('express')
const ProductsController = require('../controllers/ProductsController')
const ProductsRoutes = express.Router()

ProductsRoutes
	.post(`/images/products`, ProductsController.createImage)
	.get(`/images/products/code/:code`, ProductsController.listImage)
	// .put(`/images/products/code/:code`, uploadProducts.single('image'), ProductsController.updateImage)
	.delete(`/images/products/code/:code`, ProductsController.deleteImage)


module.exports = ProductsRoutes
