const ImageProducts = require('../models/imgproducts')
const fs = require('fs')
const path = require('path')
const ProductsRepository = require('../repositories/ProductsRepository')

class ProductsController {


    async createImage(req, res) {

        if (!req.file) {
            return res.status(400).json({ error: 'Imagem é requerida' })
        }
        console.log(req.file)
        let { filename: name, size } = req.file
        let { video, code } = req.body

        if (!code) {
            res.status(400).json({ error: 'Código é requerido' })
        }

        let imageExists = await ProductsRepository.findByCode(code)

        if (imageExists) {
            let imagePath = path.resolve(__dirname, '..', '..', 'public', 'upload', 'imagesProducts', name)
            fs.unlinkSync(imagePath)
            return res.status(400).json({ error: `Já existe imagem com o código ${code}` })
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

        res.json({...imageProduct.dataValues, pathimage: `http://${process.env.SERVER_ADDRESS}:${process.env.PORT}/files/imagesProducts/${imageProduct.name}` })
    }

    async updateImage(req, res) {
        
        let codeCurrent = req.params.code
        let { video, code: newCode } = req.body

        if (req.file){
            let fileNameUpdate = req.file.filename
            fs.unlinkSync(path.resolve(__dirname, '..', '..', 'public', 'upload', 'imagesProducts', fileNameUpdate))
        }   

        // 1° Verificando se existe novo código!
        if (!newCode) {
            return res.status(404).json({ error: 'Novo Código é requerido' })
        }

        // 2° Verificando se a imagem a ser modificada existe!
        let imageBD = await ProductsRepository.findByCode(codeCurrent)
        console.log(req.file.filename)
        if (!imageBD) { 
            return res.status(404).json({ error: 'Imagem não encontrada' })
        }

        // 3° Verificando se o novo código já está em uso!
        let newCodeInUse = false
        if (codeCurrent !== newCode) {
            newCodeInUse = await ProductsRepository.findByCode(newCode)
        }

        if (newCodeInUse) return res.status(400).json({ error: `O código ${newCode} já está em uso` })

        let imageUpdated;
        // 4° Verificando se existe imagem na requisição!
        if (req.file) {
            let { originalname: name, size } = req.file
            fs.unlinkSync(path.resolve(__dirname, '..', '..', 'public', 'upload', 'imagesProducts', imageBD.dataValues.name))
            imageUpdated = await ProductsRepository.updateAll({ name, codeCurrent, newCode, video, size })
        }else {
            imageUpdated = await ProductsRepository.update({ codeCurrent, newCode, video })
        }
        // 5° Verificando se imagem foi atualizada no banco de dados
        if(imageUpdated){
            return res.sendStatus(200)
        }

        return res.status(400).json({ error: 'Imagem não atualizada, erro no servidor'})
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