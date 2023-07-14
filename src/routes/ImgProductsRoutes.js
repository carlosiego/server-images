const express = require('express')
const ImgProductsController = require('../controllers/ImgProductsController')
const ImgProductsRoutes = express.Router()

ImgProductsRoutes

	.post(`/images/product/code/:code`, ImgProductsController.createImage)
	.post(`/images/products/codes/:codes`, ImgProductsController.createImageWithManyCodes)
	.get(`/images/products/code/:code`, ImgProductsController.listImage)
	// .put(`/images/products/code/:code`, uploadProducts.single('image'), ImgProductsController.updateImage)
	.delete(`/images/products/code/:code`, ImgProductsController.deleteImage)


module.exports = ImgProductsRoutes
