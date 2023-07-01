const express = require('express')
const LocationsController = require('../controllers/LocationsController')
const LocationsRoutes = express.Router()
const uploadLocations = require('../middlewares/uploadLocations')


LocationsRoutes
    // ========================================= IMAGES LOCATIONS ====================================================================
    .post(`/images/locations`, uploadLocations.single('image'), LocationsController.createImage)
    .get(`/images/locations/code/:code`, LocationsController.listImages)
    .put(`/images/locations/name/:name`, uploadLocations.single('image'), LocationsController.updateImage)
    .delete(`/images/locations/name/:name`, LocationsController.deleteImage)

module.exports = LocationsRoutes
