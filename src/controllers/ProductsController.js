const ProductsRepository = require('../repositories/ProductsRepository')
const HandleImageServer = require('../HandleImageServer')
const uploadProducts = require('../middlewares/uploadProducts')


class ProductsController {

  async createImage(req, res) {

    let { link, main, createdBy } = req.query
		let { codes } = req.params
		let productExists;

		try {
			codes = JSON.parse(codes)
		}catch {
			return res.status(400).json({error: 'Dados inválidos'})
		}

    if (codes.length === 0) {
        return res.status(400).json({ error: 'Código é requerido' })
    }
		console.log(codes.length)
		if (codes.length === 1 || !codes.length) {
			return res.json('Só tem um')
			// productExists = await ProductsRepository.findByCode(codes)
	}
		return res.json('mais de um')

		// if(productExists) return res.status(400).json({ error: 'Código já existe' })

		// uploadProducts.single('image')(req, res, async (err) => {
		// 	if(err) {
		// 		console.log(err)
		// 		return res.status(400).json({error: 'Erro no upload da imagem'})
		// 	}
		// 	let { filename, size } = req.file

		// 	let imageCreated = await ProductsRepository.createImage({ code, filename, size, link, main, createdBy })
		// 	return res.json(imageCreated)
		// })

  }

    async listImage(req, res) {

			const { code } = req.params

			let imageProduct = await ProductsRepository.findByCode(code)
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
        let imageBD = await ProductsRepository.findByCode(codeCurrent)
        if (!imageBD) {
            if (req.file) {
                await HandleImageServer.deleteImage({ dir: process.env.DIR_IMAGES_PRODUCTS, filename: req.file.filename })
            }
            return res.status(404).json({ error: `Imagem com o código ${codeCurrent} não encontrada` })
        }

        // 3° Verificando se o novo código já está em uso!
        let newCodeInUse;
        if (codeCurrent !== newCode) {
            newCodeInUse = await ProductsRepository.findByCode(newCode)
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
            imageUpdated = await ProductsRepository.updateAll({ name, codeCurrent, newCode, video, size })
        } else {
            imageUpdated = await ProductsRepository.update({ codeCurrent, newCode, video })
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

        let image = await ProductsRepository.findByCode(code)

        if (!image) return res.status(400).json({ error: 'Não existe imagem com o código ' + code })

        Promise.all([
            ProductsRepository.deleteByCode(code),
            HandleImageServer.deleteImage({ dir: process.env.DIR_IMAGES_PRODUCTS, filename: image.name })
        ])

        res.sendStatus(200)

    }
}

module.exports = new ProductsController()
