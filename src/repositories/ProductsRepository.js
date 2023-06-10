const ImageProducts = require('../models/imgproducts')

class ProductsRepository {

    async create( code, name, size, video ) {

         let imageProduct = await ImageProducts.create({ 
            code,
            name,
            size,
            video
        })
        console.log(imageProduct)
        return imageProduct;
    }

    async findByCode(code) {

        let image = await ImageProducts.findOne({ where: { code: code } })

        return image;
    }

    async update({ name, codeCurrent, newCode, video, size }) {

        let image = await ImageProducts.update(
            { 
              name,
              code: newCode,
              video,
              size
            }, 
            { where: { code: codeCurrent }}
        )

        return image;
    }
}

module.exports = new ProductsRepository()