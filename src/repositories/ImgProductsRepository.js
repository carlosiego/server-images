const Images = require('../models/tables/images')
const ImgProducts = require('../models/tables/imgproducts')
const db = require('../models/dbConfig')
const { QueryTypes } = require('sequelize');

class ImgProductsRepository {

	async createImage({ filename, size, main, code, createdBy }) {

		main = main == 1 ? 1 : 0

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

	async createAssociationImageAndProduct({ code, createdBy, id }) {

		let tableImgProducts = await ImgProducts.create({
			product_id: code,
			image_id: id,
			createdBy
		})

		return tableImgProducts;
	}

	async createImageWithManyCodes({ filename, size, main, imagesProductsToCreate }) {

		main = main == 1 ? 1 : 0

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

	async findById(id) {

		let image = await Images.findOne({ where: { id } })

		return image;
	}

	async findImageByIdAndCode(code, id) {
		let image = await ImgProducts.findOne({
			where: {
				product_id: code,
				image_id: id
			}
		})

		return image
	}

	async findByCode(code) {

		let image = await db.query(
			`SELECT
				IMAGES.id,
				IMAGES.name
			FROM IMGPRODUCTS
			JOIN IMAGES ON IMGPRODUCTS.image_id = IMAGES.id
			WHERE IMGPRODUCTS.product_id = :code;`,
			{
				replacements: { code: code },
				type: QueryTypes.SELECT,
			})

		return image;
	}

	async findByCodes(codes) {
		console.log(codes.length)
		let images = await db.query(
			`SELECT
					IMGPRODUCTS.product_id,
					IMAGEs.name
				FROM IMGPRODUCTS
				JOIN IMAGES ON IMGPRODUCTS.image_id = IMAGES.id
				WHERE IMGPRODUCTS.product_id IN (:codes) AND IMAGES.main = 1
				LIMIT :arrayLength;`,
			{
				replacements: { codes, arrayLength: codes.length },
				type: QueryTypes.SELECT
			}
		)

		return images;
	}

	async findByName(name) {

		let image = await Images.findOne({ where: { name } })

		return image
	}

	async updateById({ id, main }) {

		let image = await Images.update(
			{
				main
			},
			{ where: { id } }
		)

		return image;
	}

	async updateAll({ name, codeCurrent, newCode, video, size }) {

		let image = await ImgProducts.update(
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

	async deleteImageById(id) {

		Promise.all([
			ImgProducts.destroy({ where: { image_id: id } }),
			Images.destroy({ where: { id } })

		]).then(results => console.log(results))
			.catch(error => console.log(error))
	}



}

module.exports = new ImgProductsRepository()
