const express = require('express')
const LocationsController = require('../controllers/LocationsController')
const LocationsRoutes = express.Router()
const uploadLocations = require('../middlewares/uploadLocations')


LocationsRoutes
    // ========================================= IMAGES LOCATIONS ====================================================================
    .post(`/${process.env.SECRET_API}/images/locations`, uploadLocations.single('image'), LocationsController.createImage)
    .get(`/${process.env.SECRET_API}/images/locations/code/:code`, LocationsController.listImages)
    .put(`/${process.env.SECRET_API}/images/locations/name/:name`, uploadLocations.single('image'), LocationsController.updateImage)
    .delete(`/${process.env.SECRET_API}/images/locations/name/:name`, LocationsController.deleteImage)

module.exports = LocationsRoutes
