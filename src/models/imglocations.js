const Sequelize = require('sequelize')
const db = require('./dbConfig.js')
const ImageProducts = require('./imgproducts.js')

const ImageLocations = db.define('IMGLOCATIONS', {

    name: {
        primaryKey: true,
        type: Sequelize.STRING,
        allowNull: false
    },

    size: {
        type: Sequelize.INTEGER,
        allowNull: false
    },

    storehouse: {
        type: Sequelize.STRING,
        allowNull: false
    },

    street: {
        type: Sequelize.STRING,
        allowNull: true
    },

    side: {
        type: Sequelize.STRING,
        allowNull: true
    },

    shelf: {
        type: Sequelize.STRING,
        allowNull: true
    },

    column: {
        type: Sequelize.STRING,
        allowNull: true
    },

    description: {
        type: Sequelize.STRING,
        allowNull: true
    },

    imageProductCode: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'IMGPRODUCTS',
            key: 'code'
        }
    }

})


// ImageLocations.sync()

module.exports = ImageLocations