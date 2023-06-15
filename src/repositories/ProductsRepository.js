const ImageProducts = require('../models/imgproducts')

class ProductsRepository {

    async create({ code, filename, size, video }) {

        let imageProduct = await ImageProducts.create({
            code,
            name: filename,
            size,
            video
        })

        return imageProduct;
    }

    async findByCode(code) {

        let image = await ImageProducts.findOne({ where: { code: code } })

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
        try {
            ImageProducts.destroy({ where: { code } })
        } catch (error) {
            console.log('auau')
        }
    }
}

module.exports = new ProductsRepository()