const express = require('express')
const imagesProductsController = require('../controllers/productsController')
const imagesProductsRoutes = express.Router()
const uploadProducts = require('../middlewares/uploadProducts.js')

imagesProductsRoutes
// ========================================= IMAGES PRODUCTS ===============================================================
    .post(`/${process.env.SECRET_API}/images/products`, uploadProducts.single('image'), imagesProductsController.uploadImageProducts)
    .get(`/${process.env.SECRET_API}/images/products/code/:code`, imagesProductsController.getImageProducts)
    .put(`/${process.env.SECRET_API}/images/products/code/:code`, imagesProductsController.changeImageProducts)
    .delete(`/${process.env.SECRET_API}/images/products/code/:code`, imagesProductsController.deleteImageProducts)


module.exports = imagesProductsRoutes