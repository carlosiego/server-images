const ImageProducts = require('../models/imgproducts')
const fs = require('fs')
const path = require('path')
const ProductsRepository = require('../repositories/ProductsRepository')

class ProductsController {


    async createImage(req, res) {

        if (!req.file) {
            return res.status(400).json({ error: 'Imagem é requerida' })
        }

        let { filename: name, size } = req.file
        let { video, code } = req.body

        if (!code) {
            res.status(400).json({ error: 'Código é requerido' })
        }

        let imageExists = await ProductsRepository.findByCode(code)

        if (imageExists) {
            let imagePath = path.resolve(__dirname, '..', '..', 'public', 'upload', 'imagesProducts', name)
            fs.unlinkSync(imagePath)
            return res.status(400).json({ error: 'Já existe imagem com este código' })
        }

        let imageCreated = await ProductsRepository.create({ code, name, size, video })

        return res.json(imageCreated)
    }

    async listImage(req, res) {

        const code = req.params.code

        let imageProduct = await ProductsRepository.findByCode(code)

        if (!imageProduct) {
            return res.status(404).json({ error: 'Imagem não encontrada' })
        }

        res.json(imageProduct)
    }

    async updateImage(req, res) {

        // 1° Verificando se existe imagem na requisição!
        if (!req.file) {
            return res.status(400).json({ error: 'Imagem é requerida' })
        }

        let codeCurrent = Number(req.params.code)
        let { video, code: newCode } = req.body
        let { originalname: name, size } = req.file

        // 2° Verificando se existe novo código!
        if (!newCode) {
            return res.status(404).json({ error: 'Código é requerido' })
        }

        // 3° Verificando se a imagem a ser modificada existe!
        let imageBD = await ProductsRepository.findByCode(codeCurrent)

        if (!imageBD) {
            return res.status(404).json({ error: 'Imagem não encontrada' })
        }

        // 4° Verificando se o novo código já está em uso!
        let newCodeInUse = false
        if (codeCurrent !== newCode) {
            newCodeInUse = await ProductsRepository.findByCode(newCode)
        }
        if (newCodeInUse) return res.status(400).json({ error: 'O código já está em uso' })

        let imageUpdated = await ProductsRepository.update({{ name, codeCurrent, newCode, video, size }})

        res.json({ imageUpdated })
}

    async deleteImage(req, res) {
    let code = req.params.code
    let isImage = await ImageProducts.findOne({ where: { code: code } })

    if (isImage) {
        await ImageProducts.destroy({ where: { code } })
            .then(() => {
                fs.unlinkSync(`./public/upload/imagesProducts/${isImage.name}`)
                return res.json({
                    error: false,
                    message: 'Imagem excluída com sucesso!'
                })
            }).catch(() => {
                return res.status(400).json({
                    error: true,
                    message: 'Erro, não foi possivel deletar!'
                })
            })
    } else {
        return res.status(400).json({
            error: true,
            message: 'Erro, não existe imagem com o código: ' + code
        })
    }
}
}

module.exports = new ProductsController()