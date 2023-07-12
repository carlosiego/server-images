const ProductsRepository = require('../repositories/ProductsRepository')

class ProductsController {

	async createProduct(req, res) {

		let { code, link } = req.body
		console.log(req.body)

		const productExists = await ProductsRepository.findByCode(code)

		if (productExists) return res.status(400).json({ error: 'Produto já existe' })

		const product = await ProductsRepository.createProduct(code, link)

		return res.json(product)
	}

}

module.exports = new ProductsController()
