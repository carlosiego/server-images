const express = require('express')
const ImgProductsController = require('../controllers/ImgProductsController')
const ImgProductsRoutes = express.Router()

ImgProductsRoutes

	.get(`/images/products/code/:code`, ImgProductsController.listImageByCode)
	.get(`/images/products/codes/:codes`, ImgProductsController.listImagesByCodes)
	.get(`/images/products/name/:name`, ImgProductsController.listImageByName)
	.get(`/images/products/id/:id`, ImgProductsController.listImageById)
	.put(`/images/products/name/:name`, ImgProductsController.updateImageByName)
	.post(`/images/product/code/:code`, ImgProductsController.createImage)
	.post(`/images/products/codes/:codes`, ImgProductsController.createImageWithManyCodes)
	.delete(`/images/products/id/:id`, ImgProductsController.deleteImageById)


module.exports = ImgProductsRoutes
