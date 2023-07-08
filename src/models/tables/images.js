const Sequelize = require('sequelize')
const db = require('../dbConfig')

const Images = db.define('IMAGES', {
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
        allowNull: false,
    },

    main: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    }
})

module.exports = Images