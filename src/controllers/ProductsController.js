const ProductsRepository = require('../repositories/ProductsRepository')

class ProductsController {

	async createProduct(req, res) {

		let { code, link } = req.body

		if (typeof code === 'string') return res.json('é string')

		const productExists = await ProductsRepository.findByCode(code)

		if (productExists) return res.status(400).json({ error: 'Produto já existe' })

		const product = await ProductsRepository.createProduct(code, link)

		return res.json(product)
	}

	async listProduct(req, res) {

		let { code } = req.params

		const product = await ProductsRepository.findByCode(code)

		return res.json(product)
	}

	async updateProduct(req, res) {

		let { link } = req.body
		let { code } = req.params

		const product = await ProductsRepository.findByCode(code)

		if (!product) return res.status(404).json({ error: 'Produto não existe' })

		const productRenewed = await ProductsRepository.updateImage(code, link)

		if (!productRenewed) return res.status(400).json({ error: 'Não foi possível atualizar produto' })

		return res.sendStatus(200)
	}

}

module.exports = new ProductsController()
