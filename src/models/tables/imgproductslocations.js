const Sequelize = require('sequelize')
const db = require('../dbConfig')

const ImgProductsLocations = db.define('IMGPRODUCTSLOCATIONS', {

    product_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
            model: 'PRODUCTS',
            key: 'code'
        }
    },

    image_location_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
            model: 'IMGLOCATIONS',
            key: 'id'
        }
    },

    createdBy: {
        type: Sequelize.STRING,
        allowNull: false
    },

    updatedBy: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

// ImgProductsLocations.sync()

module.exports = ImgProductsLocations
