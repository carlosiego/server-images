const Products = require('../models/tables/products')
const { Op } = require('sequelize')

class ProductsRepository {

	async createProduct(code, link) {

		let product = await Products.create({
			code,
			link
		})

		return product;
	}

	async findByCode(code) {

		let product = await Products.findOne({
			where: { code }
		})

		return product;
	}

	async findByCodes(codes) {

		let products = await Products.findAll({
			where: {
				code: {
					[Op.in]: codes
				}
			}
		})

		return products;
	}

	async updateImage(code, link) {

		let productWasRenewed = Products.update({
			link
		}, { where: { code } })

		return productWasRenewed;
	}

	async deleteProduct(code) {

		let productDeleted = await Products.destroy({ where: { code } })

		return productDeleted
	}
}

module.exports = new ProductsRepository()
