const Sequelize = require('sequelize')
const db = require('../dbConfig')

const Products = db.define('PRODUCTS', {
    
    code: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        allowNull: false
    },
    
    imgprod_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },

    imgloc_id : {
        type: Sequelize.INTEGER,
        allowNull: true
    },

    video_id: { 
        type: Sequelize.INTEGER,
        allowNull: true
    }
})

module.exports = Products