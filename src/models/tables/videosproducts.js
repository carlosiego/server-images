const Sequelize = require('sequelize')
const db = require('../dbConfig')

const VideosProducts = db.define('VIDEOSPRODUCTS', {

    id: {
        primarykey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false
    },

    link: {
        type: Sequelize.STRING,
        allowNull: false
    }
})



module.exports = VideosProducts