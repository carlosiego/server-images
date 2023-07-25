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
	}

});

// ImgProducts.sync()

module.exports = ImgProducts
