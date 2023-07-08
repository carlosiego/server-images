const Sequelize = require('sequelize')
const db = require('../dbConfig.js')

const ImgProducts = db.define('IMGPRODUCTS', {

    product_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
            model: 'PRODUCTS',
            key: 'code'
        }
    },

    image_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
            model: 'IMAGES',
            key: 'id'
        }
    },

    createdBy: {
        type: Sequelize.STRING,
        allowNull: false
    },

    updatedBy: {
        type: Sequelize.STRING,
        allowNull: true
    },

    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },

    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
    }
});


module.exports = ImgProducts