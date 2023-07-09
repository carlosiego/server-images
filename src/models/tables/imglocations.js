const Sequelize = require('sequelize')
const db = require('../dbConfig.js')

const ImgLocations = db.define('IMGLOCATIONS', {

    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
}, { timestamps: false }
);

ImgLocations.sync()

module.exports = ImgLocations