const express = require('express')
const ProductsController = require('../controllers/ProductsController')
const ProductsRoutes = express.Router()
const uploadProducts = require('../middlewares/uploadProducts')

ProductsRoutes

    .post(`/${process.env.SECRET_API}/images/products`, uploadProducts.single('image'), ProductsController.createImage)
    .get(`/${process.env.SECRET_API}/images/products/code/:code`, ProductsController.listImage)
    .put(`/${process.env.SECRET_API}/images/products/code/:code`, ProductsController.updateImage)
    .delete(`/${process.env.SECRET_API}/images/products/code/:code`, ProductsController.deleteImage)


module.exports = ProductsRoutes