const Sequelize = require('sequelize')
const db = require('./dbConfig.js')

const ImageProducts = db.define('IMGPRODUCTS', {

    code: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },

    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    size: {
        type: Sequelize.INTEGER,
        allowNull: false
    },

    video: {
        type: Sequelize.STRING,
        allowNull: true
    }
})

// ImageProducts.hasMany(ImageLocations, {
//     foreignKey: 'imageProductId',
//     as: 'locations'
// });


// ImageProducts.sync()

module.exports = ImageProducts