const ImgProductsRepository = require('../repositories/ImgProductsRepository')
const uploadProducts = require('../middlewares/uploadProducts')
const ProductsRepository = require('../repositories/ProductsRepository')
const s3 = require('../utils/aws.config')
const path = require('path')
const fs = require('fs')

class ImgProductsController {

	async createImage(req, res) {

		let { main, createdBy } = req.query
		let { code } = req.params
		let imageCreated

		code = Number(code)

		if (isNaN(code)) return res.status(400).json({ error: 'Código tem que ser do tipo número' })

		if (typeof code !== 'number') return res.status(400).json({ error: 'Código tem que ser do tipo número' })

		if (!createdBy) return res.status(400).json({ error: 'Criador da Imagem é requerido' })

		let productExist = await ProductsRepository.findByCode(code)
		if (!productExist) return res.status(404).json({ error: 'Produto não existe' })

		uploadProducts.single('image')(req, res, async (err) => {
			if (err) {
				console.log(err)
				return res.status(400).json({ error: 'Erro ao fazer o upload' })
			}

			let { filename, size } = req.file

			const originalPath = path.resolve(__dirname, "..", "..", "tmp", filename)
			const fileContent = await fs.promises.readFile(originalPath)

			try {
				imageCreated = await ImgProductsRepository.createImage({ filename, size, main, code, createdBy })
			} catch (err) {
				console.log(err)
				await fs.promises.unlink(originalPath, (err) => {
					if (err) {
						console.log(err)
					}
				})
				return res.status(400).json({ error: 'Erro ao fazer upload' })
			}

			const params = {
				Bucket: process.env.BUCKET_PRODUCTS,
				Key: filename,
				Body: fileContent
			}

			s3.upload(params, async (err, data) => {
				if (err) {
					console.log(err)
					await fs.promises.unlink(originalPath, (err) => {
						if (err) {
							console.log(err)
						}
					})
					await this.deleteImageById(imageCreated.image_id)
					return res.status(400).json({ error: 'Erro ao fazer o upload' })
				}

				console.log('Upload realizado com sucesso:', data.Location)
			})
			await fs.promises.unlink(originalPath, (err) => {
				if (err) {
					console.log(err)
				}
			})

			return res.json(imageCreated)
		})
	}

	async createAssociation(req, res) {

		let { createdBy, id } = req.body
		let { code } = req.params

		code = Number(code)

		if (isNaN(code)) return res.status(400).json({ error: 'Código tem que ser do tipo número' })

		if (typeof code !== 'number') return res.status(400).json({ error: 'Código tem que ser do tipo número' })

		if (!createdBy) return res.status(400).json({ error: 'Criador da Imagem é requerido' })

		let productExist = await ProductsRepository.findByCode(code)
		if (!productExist) return res.status(404).json({ error: 'Produto não existe' })

		id = Number(id)

		if (isNaN(id)) {
			return res.status(400).json({ error: 'Id tem que ser do tipo número' })
		}

		let image = await ImgProductsRepository.findById(id)

		if (!image) return res.status(404).json({ error: 'Imagem não encontrada' })

		let ImageExistsInTableImgProducts = await ImgProductsRepository.findImageByIdAndCode(code, id)

		if (ImageExistsInTableImgProducts) return res.status(400).json({ error: 'Produto já associado com essa imagem' })

		let imageCreated = await ImgProductsRepository.createAssociationImageAndProduct({ code, createdBy, id })

		if (!imageCreated) return res.status(400).json({ error: "Não foi possível criar a associação com a imagem" })

		return res.json(imageCreated)
	}

	async createImageWithManyCodes(req, res) {

		let { main, createdBy } = req.query
		let { codes } = req.params
		let productsExist = []
		let imagesProductsToCreate
		let imagesCreated

		if (!createdBy) return res.status(400).json({ error: 'Criador da Imagem é requerido' })

		try {
			codes = await JSON.parse(codes)
		} catch {
			return res.status(400).json({ error: 'Dados inválidos' })
		}

		let isArray = Array.isArray(codes)

		if (!isArray || codes.length === 1) return res.status(400).json({ error: 'Dados inválidos' })
		if (isArray && codes.length === 0) return res.status(400).json({ error: 'Código é requerido' })

		productsExist = await ProductsRepository.findByCodes(codes)

		if (codes.length !== productsExist.length) return res.status(400).json({ error: 'Alguns produtos não existe ou são repetidos, cadastre-os produtos antes de associar a imagem' })

		uploadProducts.single('image')(req, res, async (err) => {
			if (err) {
				console.log(err)
				return res.status(400).json({ error: 'Erro no upload da imagem' })
			}

			let { filename, size } = req.file

			imagesProductsToCreate = codes.map(code => ({
				product_id: code,
				createdBy
			}))

			const originalPath = path.resolve(__dirname, "..", "..", "tmp", filename)
			const fileContent = await fs.promises.readFile(originalPath)

			try {
				imagesCreated = await ImgProductsRepository.createImageWithManyCodes({ filename, size, main, imagesProductsToCreate })
			} catch (err) {
				console.log(err)
				await fs.promises.unlink(originalPath, (err) => {
					if (err) {
						console.log(err)
					}
				})
				return res.status(400).json({ error: 'Erro ao fazer upload' })
			}

			const params = {
				Bucket: process.env.BUCKET_PRODUCTS,
				Key: filename,
				Body: fileContent
			}

			s3.upload(params, async (err, data) => {
				if (err) {
					console.log(err)
					await fs.promises.unlink(originalPath, (err) => {
						if (err) {
							console.log(err)
						}
					})
					await this.deleteImageById(imagesCreated[0].image_id)
					return res.status(400).json({ error: 'Erro ao fazer o upload na aws-s3' })
				}

				console.log('Upload realizado com sucesso:', data.Location)
			})
			await fs.promises.unlink(originalPath, (err) => {
				if (err) {
					console.log(err)
				}
			})

			return res.json(imagesCreated)
		}
		)
	}

	async listImageById(req, res) {

		let { id } = req.params
		id = Number(id)

		if (isNaN(id)) {
			return res.status(400).json({ error: 'Id tem que ser do tipo número' })
		}

		let image = await ImgProductsRepository.findById(id)
		let imageWithPath;

		if (!image) return res.status(404).json({ error: 'Imagem não encontrada' })

		imageWithPath = {
			...image.dataValues,
			pathimage: `https://${process.env.BUCKET_PRODUCTS}.s3.sa-east-1.amazonaws.com/${image.name}`
		}

		return res.json(imageWithPath)
	}

	async listImagesByCode(req, res) {

		let { code } = req.params
		code = Number(code)

		if (isNaN(code)) {
			return res.status(400).json({ error: 'Código tem que ser do tipo número' })
		}

		let imagesProduct = await ImgProductsRepository.findByCode(code)
		let imagesWithPath;

		if (!imagesProduct.length) return res.status(404).json({ error: 'Imagens não encontradas' })

		imagesWithPath = imagesProduct.map(image => ({
			...image,
			pathimage: `https://${process.env.BUCKET_PRODUCTS}.s3.sa-east-1.amazonaws.com/${image.name}`
		}))

		return res.json(imagesWithPath)
	}

	async listImagesByCodes(req, res) {

		let { codes } = req.params

		try {
			codes = await JSON.parse(codes)
		} catch {
			return res.status(400).json({ error: 'Dados inválidos' })
		}

		let isArray = Array.isArray(codes)

		if (!isArray) return res.status(400).json({ error: 'Dados inválidos' })
		if (isArray && codes.length === 0) return res.status(400).json({ error: 'Código é requerido' })

		let images = await ImgProductsRepository.findByCodes(codes)

		const uniqueImagesMainWithPath = images.reduce((result, image) => {
			const existingImage = result.find((obj) => obj.product_id === image.product_id);
			if (!existingImage) {
				const pathimage = `https://${process.env.BUCKET_PRODUCTS}.s3.sa-east-1.amazonaws.com/${image.name}`;
				result.push({ ...image, pathimage });
			}
			return result;
		}, []);

		return res.json(uniqueImagesMainWithPath)
	}

	async listImageByName(req, res) {

		let { name } = req.params

		let image = await ImgProductsRepository.findByName(name)

		if (!image) return res.status(404).json({ error: 'Imagem não encontrada' })

		let imageWithPath = {
			...image.dataValues,
			pathimage: `https://${process.env.BUCKET_PRODUCTS}.s3.sa-east-1.amazonaws.com/${image.name}`
		}

		return res.json(imageWithPath)
	}

	async updateImageById(req, res) {

		let { id } = req.params
		let { main } = req.body

		main = Number(main)
		id = Number(id)

		if (isNaN(id)) {
			return res.status(400).json({ error: 'Id tem que ser do tipo número' })
		}

		if (!main && main !== 0) return res.status(400).json({ error: 'Main tem que ser do tipo número' })
		if (main !== 0 && main !== 1) return res.status(400).json({ error: 'Main tem que ser 0 ou 1' })

		let image = await ImgProductsRepository.findById(id)
		if (!image) return res.status(404).json({ error: 'Imagem não encontrada' })

		if (image.main && main === 1) return res.json({ message: 'Imagem já é principal' })
		if (!image.main && main === 0) return res.json({ message: 'Imagem já é secundária' })

		let imageWasUpdated = await ImgProductsRepository.updateById({ id, main })

		if (imageWasUpdated) return res.sendStatus(200)

		return res.status(400).json({ error: 'Não foi possível atualizar a imagem' })
	}

	async deleteImageById(req, res) {

		let { id } = req.params
		id = Number(id)

		if (isNaN(id)) {
			return res.status(400).json({ error: 'Id tem que ser do tipo número' })
		}

		let image = await ImgProductsRepository.findById(id)

		if (image === null) {
			return res.status(404).json({ error: 'Imagem não encontrada' })
		}

		await ImgProductsRepository.deleteImageById(id)

		const params = {
			Bucket: process.env.BUCKET_PRODUCTS,
			Key: image.name,
		}

		s3.deleteObject(params, (err, data) => {
			if (err) {
				console.log('Erro ao excluir imagem na aws-s3: ' + data)
				return res.json(400).json({ error: 'Erro ao excluir imagem na aws-s3' })
			}
		})

		return res.sendStatus(200)
	}
}

module.exports = new ImgProductsController()
