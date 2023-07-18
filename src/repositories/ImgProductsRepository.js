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

	async findByCode(code) {

		let image = await db.query(
			`SELECT
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

		let images = []
		codes.map(async code => (
			db.query(
				`SELECT
					IMGPRODUCTS.product_id,
					IMAGEs.name
				FROM IMGPRODUCTS
				JOIN IMAGES ON IMGPRODUCTS.image_id = IMAGES.id
				WHERE IMGPRODUCTS.product_id = :code AND IMAGES.main = 1
				LIMIT 1;`,
				{
					replacements: { code },
					type: QueryTypes.SELECT
				}
			).then(res => {console.log(res[0]), images.push(res[0])})
		));

		return images;
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
