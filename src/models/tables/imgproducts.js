const Sequelize = require('sequelize')
const db = require('../dbConfig.js')

const ImgProducts = db.define('IMGPRODUCTS', {

    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    name: {
        type: Sequelize.STRING,
        allowNull: false
    },

    size: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})


module.exports = ImgProducts