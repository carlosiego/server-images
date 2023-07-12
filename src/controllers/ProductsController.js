const ProductsRepository = require('../repositories/ProductsRepository')

class ProductsController {

	async createProduct(req, res) {

		let { code, link } = req.body

		if (typeof code === 'string') return res.status(400).json({ error: 'Código tem que ser do tipo número' })

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

		const productExists = await ProductsRepository.findByCode(code)

		if (!productExists) return res.status(404).json({ error: 'Produto não encontrado' })

		const productWasRenewed = await ProductsRepository.updateImage(code, link)

		if (!productWasRenewed) return res.status(400).json({ error: 'Não foi possível atualizar o produto' })

		return res.sendStatus(200)
	}

	async deleteProduct(req, res) {

		let { code } = req.params

		let productExists = await ProductsRepository.findByCode(code)

		if (!productExists) return res.status(404).json({ error: 'Produto não encontrado' })

		let productDeleted = await ProductsRepository.deleteProduct(code)

		if (!productDeleted) return res.status(400).json({ error: 'Não foi possível deletar o produto' })

		return res.sendStatus(200)
	}

}

module.exports = new ProductsController()
