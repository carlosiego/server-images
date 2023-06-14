const ImageProducts = require('../models/imgproducts')
const fs = require('fs')
const path = require('path')
const ProductsRepository = require('../repositories/ProductsRepository')
const getLatestFile = require('../functions/getLatestFile')
const deleteImageServer = require('../functions/deleteImageServer')

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
        let dir = 'imagesProducts'
        let filename;
        // 1° Verificando se existe novo código!
        // Se não existir e a requisição tiver uma imagem, exclua a imagem !
        if (!newCode) {
            if(req.file){
                filename = req.file.filename
                await deleteImageServer({ dir, filename })
            }
            return res.status(404).json({ error: 'Novo Código é requerido' })
        }

        // 2° Verificando se a imagem a ser modificada existe!
        // Se a imagem a ser modifica não existir, exclua a imagem enviada!
        let imageBD = await ProductsRepository.findByCode(codeCurrent)
        if (!imageBD) { 
            if(req.file){
                filename = req.file.filename
                await deleteImageServer({ dir, filename })
            }
            return res.status(404).json({ error: `Imagem com o código ${codeCurrent} não encontrada` })
        }

        // 3° Verificando se o novo código já está em uso!
        let newCodeInUse;
        if (codeCurrent !== newCode) {
            newCodeInUse = await ProductsRepository.findByCode(newCode)
        }
        // Se o novo código já estiver em uso por outra imagem que não é a que vai ser atualizada, exclua a imagem enviada!
        if (newCodeInUse){
            if(req.file){
                filename = req.file.filename
                await deleteImageServer({ dir, filename })
            }
            return res.status(400).json({ error: `O código ${newCode} já está em uso` })
        }

        let imageUpdated;
        // 4° Verificando se existe imagem na requisição!
        // Se existir imagem na requisição 
        if (req.file) {
            let { filename: name, size } = req.file
            imageUpdated = await ProductsRepository.updateAll({ name, codeCurrent, newCode, video, size })
        }else {
            imageUpdated = await ProductsRepository.update({ codeCurrent, newCode, video })
        }
        // 5° Verificando se imagem foi atualizada no banco de dados, e se sim delete a imagem anterior no disco
        if(imageUpdated){
            if(req.file) {
                filename = imageBD.dataValues.name
                await deleteImageServer({ dir, filename })
            }
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