const express = require('express')
const ImgProductsController = require('../controllers/ImgProductsController')
const ImgProductsRoutes = express.Router()

ImgProductsRoutes

	.post(`/images/products/code/:codes`, ImgProductsController.createImage)
	.get(`/images/products/code/:code`, ImgProductsController.listImage)
	// .put(`/images/products/code/:code`, uploadProducts.single('image'), ImgProductsController.updateImage)
	.delete(`/images/products/code/:code`, ImgProductsController.deleteImage)


module.exports = ImgProductsRoutes
