const express = require('express')
const imagesLocationsController = require('../controllers/locationsController')
const imagesLocationsRoutes = express.Router()
const uploadLocations = require('../middlewares/uploadLocations')

imagesLocationsRoutes
// ========================================= IMAGES LOCATIONS ====================================================================
    .post(`/${process.env.SECRET_API}/images/locations`, uploadLocations.single('image'), imagesLocationsController.uploadImageLocations)
    .get(`/${process.env.SECRET_API}/images/locations/code/:code`, imagesLocationsController.getImageLocations)
    .put(`/${process.env.SECRET_API}/images/locations/code/:code`, imagesLocationsController.changeImageLocations)
    .delete(`/${process.env.SECRET_API}/images/locations/code/:code`, imagesLocationsController.deleteImageLocations)

module.exports = imagesLocationsRoutes