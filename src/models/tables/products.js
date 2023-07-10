const Sequelize = require('sequelize')
const db = require('../dbConfig')

const Products = db.define('PRODUCTS', {

    code: {
        primaryKey: true,
        type: Sequelize.INTEGER,
    },

    link: {
        type: Sequelize.STRING,
        allowNull: true
    }
}, { timestamp: false })

// Products.sync()


module.exports = Products
