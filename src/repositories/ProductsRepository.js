const Products = require('../models/tables/products')

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

	async updateImage(code, link) {
		let productRenewed = Products.update({
			link
		}, { where: { code } })

		return productRenewed;
	}
}

module.exports = new ProductsRepository()
