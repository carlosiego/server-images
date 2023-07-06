const Sequelize = require('sequelize')
const db = require('../dbConfig.js')

const ImgLocations = db.define('IMGLOCATIONS', {

    id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        allowNull: false
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

    column_name: {
        type: Sequelize.STRING,
        allowNull: true
    },

    description: {
        type: Sequelize.STRING,
        allowNull: true
    }

})


module.exports = ImgLocations