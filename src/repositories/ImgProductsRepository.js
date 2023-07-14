const Images = require('../models/tables/images')
const Products = require('../models/tables/products')
const ImgProducts = require('../models/tables/imgproducts')

class ImgProductsRepository {

	async createImage({ filename, size, main = 0, code, createdBy }) {

		main = main === 1 ? 1 : 0

		let imageCreated = await Images.create({
			name: filename,
			size,
			main
		})

		let tableImgProducts = await ImgProducts.create({
			product_id: code,
			image_id: imageCreated.id,
			createdBy
		})

		return tableImgProducts;
	}


	async createImageWithManyCodes({ filename, size, main = 0, imagesProductsToCreate }) {

		main = main === 1 ? 1 : 0

		let imageCreated = await Images.create({
			name: filename,
			size,
			main
		})

		let imagesProductsToCreateWithId = imagesProductsToCreate.map(item => ({
			...item,
			image_id: imageCreated.id
		}))

		let tableImgProducts = await ImgProducts.bulkCreate(imagesProductsToCreateWithId)

		return tableImgProducts;
	}

	async findByCode(code) {

		let image = await Products.findOne({ where: { code: code } })

		return image;
	}

	async findByName(name) {
		let image = await ImageProducts.findOne({ where: { name: name } })

		return image;
	}

	async update({ codeCurrent, newCode, video }) {

		let image = await ImageProducts.update(
			{
				code: newCode,
				video: video ? video : undefined
			},
			{ where: { code: codeCurrent } }
		)

		return image;
	}

	async updateAll({ name, codeCurrent, newCode, video, size }) {

		let image = await ImageProducts.update(
			{
				name,
				code: newCode,
				video: video ? video : undefined,
				size
			},
			{ where: { code: codeCurrent } }
		)

		return image;
	}

	async deleteByCode(code) {

		await ImageProducts.destroy({ where: { code } })

	}
}

module.exports = new ImgProductsRepository()
