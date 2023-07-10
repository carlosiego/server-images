const Images = require('../models/tables/images')
const Products = require('../models/tables/products')
const ImgProducts = require('../models/tables/imgproducts')

class ProductsRepository {

    async createImage({ code, filename, size, link, main, createdBy}) {

			let tableProducts = await Products.create({
					code,
					link
			})

			let tableImages = await Images.create({
				name: filename,
				size,
				main
			})

			console.log('PRODUTOS CODE: ' + tableProducts.code,'\n IMAGES ID: ' + tableImages.id)

			let tableImgProducts = await ImgProducts.create({
				product_id: tableProducts.code,
				image_id: tableImages.id,
				createdBy
			})


			return [tableProducts, tableImages];
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

module.exports = new ProductsRepository()
