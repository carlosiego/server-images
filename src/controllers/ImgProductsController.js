const ImgProductsRepository = require('../repositories/ImgProductsRepository')
const HandleImageServer = require('../HandleImageServer')
const uploadProducts = require('../middlewares/uploadProducts')
const ProductsRepository = require('../repositories/ProductsRepository')

class ImgProductsController {

	async createImage(req, res) {

		let { main, createdBy } = req.query
		let { codes } = req.params
		let codesExistents;
		let imagesToCreate;

		try {
			codes = await JSON.parse(codes)
		} catch {
			return res.status(400).json({ error: 'Dados inválidos1' })
		}

		let isArray = Array.isArray(codes)
		console.log(typeof codes)
		console.log(codes.length)

		if (isArray && codes.length === 0) return res.status(400).json({ error: 'Código é requerido' })

		if (isArray && codes.length > 1) {
			codesExistents = await ProductsRepository.findByCodes(codes)
		}

		if(Array.isArray(codesExistents)){
			if (isArray && codes.length !== codesExistents.length) return res.status(400).json({ error: 'Alguns produtos não encontrado, cadastre todos produtos antes de associar a imagem' })
		}

		return res.json('ok')

		uploadProducts.single('image')(req, res, async (err) => {
			if (err) {
				console.log(err)
				return res.status(400).json({ error: 'Erro no upload da imagem' })
			}
			let { filename, size } = req.file

			if (codes.length === codesExistents.length) {
				imagesToCreate = codes.map(code => (
					{
						code,
						filename,
						size,
						main,
						createdBy
					}
				))
			}
			console.log(imagesToCreate)
			// await ImgProductsRepository.createImage(imagesToCreate)


			return res.json(productsCreated)
		})

	}

	async listImage(req, res) {

		const { code } = req.params

		let imageProduct = await ImgProductsRepository.findByCode(code)
		let imageWithPath = {};

		if (imageProduct) {
			imageWithPath = {
				...imageProduct.dataValues,
				pathimage: `http://${process.env.SERVER_ADDRESS}:${process.env.PORT}/files/${process.env.DIR_IMAGES_PRODUCTS}/${imageProduct.name}`
			}
		}

		return res.json(imageWithPath)
	}

	async updateImage(req, res) {

		let codeCurrent = req.params.code
		let { video, code: newCode } = req.body

		let filename;
		// 1° Verificando se existe novo código!
		// Se não existir e a requisição tiver uma imagem, exclua a imagem !
		newCode = Number(newCode)

		if (isNaN(newCode)) {
			if (req.file) await HandleImageServer.deleteImage({ dir: process.env.DIR_IMAGES_PRODUCTS, filename: req.file.filename })
			return res.status(400).json({ error: `Código tem que ser do tipo número` })
		}

		if (!newCode) {
			if (req.file) {
				await HandleImageServer.deleteImage({ dir: process.env.DIR_IMAGES_PRODUCTS, filename: req.file.filename })
			}
			return res.status(404).json({ error: 'Novo Código é requerido' })
		}

		// 2° Verificando se a imagem a ser modificada existe!
		// Se a imagem a ser modificada não existir, exclua a imagem enviada!
		let imageBD = await ImgProductsRepository.findByCode(codeCurrent)
		if (!imageBD) {
			if (req.file) {
				await HandleImageServer.deleteImage({ dir: process.env.DIR_IMAGES_PRODUCTS, filename: req.file.filename })
			}
			return res.status(404).json({ error: `Imagem com o código ${codeCurrent} não encontrada` })
		}

		// 3° Verificando se o novo código já está em uso!
		let newCodeInUse;
		if (codeCurrent !== newCode) {
			newCodeInUse = await ImgProductsRepository.findByCode(newCode)
		}
		// Se o novo código já estiver em uso por outra imagem que não é a que vai ser atualizada, exclua a imagem enviada!
		if (newCodeInUse) {
			if (req.file) {
				await HandleImageServer.deleteImage({ dir: process.env.DIR_IMAGES_PRODUCTS, filename: req.file.filename })
			}
			return res.status(400).json({ error: `O código ${newCode} já está em uso` })
		}

		let imageUpdated;
		// 4° Verificando se existe imagem na requisição!
		if (req.file) {
			let { filename: name, size } = req.file
			imageUpdated = await ImgProductsRepository.updateAll({ name, codeCurrent, newCode, video, size })
		} else {
			imageUpdated = await ImgProductsRepository.update({ codeCurrent, newCode, video })
		}
		// 5° Verificando se imagem foi atualizada no banco de dados, e se sim delete a imagem anterior no disco
		if (imageUpdated) {
			if (req.file) {
				filename = imageBD.name
				await HandleImageServer.deleteImage({ dir: process.env.DIR_IMAGES_PRODUCTS, filename })
			}
			return res.sendStatus(200)
		}

		return res.status(400).json({ error: 'Imagem não atualizada, erro no servidor' })
	}

	async deleteImage(req, res) {

		let { code } = req.params

		let image = await ImgProductsRepository.findByCode(code)

		if (!image) return res.status(400).json({ error: 'Não existe imagem com o código ' + code })

		Promise.all([
			ImgProductsRepository.deleteByCode(code),
			HandleImageServer.deleteImage({ dir: process.env.DIR_IMAGES_PRODUCTS, filename: image.name })
		])

		res.sendStatus(200)

	}
}

module.exports = new ImgProductsController()
