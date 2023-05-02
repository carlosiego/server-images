const Sequelize = require('sequelize')
const db = require('./dbConfig.js')

const ImageLocations = db.define('IMGLOCATIONS', {

    code: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },

    name: {
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
    }
    
})

// ImageLocations.sync()

module.exports = ImageLocations