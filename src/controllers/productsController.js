// http://${process.env.SERVER_ADDRESS}:${process.env.PORT}/files/not-found.png
const ImageProducts = require('../models/imgproducts')
const fs = require('fs')
const ProductsRepository = require('../repositories/ProductsRepository')

class ProductsController {


    async createImage(req, res) {

        if(!req.file) {
            return res.status(400).json({ error: 'Imagem é requerida'})
        }
      
        let code = Number(req.file.originalname.split('.')[0])
        let { originalname: name, size } = req.file
        let { video } = req.body

        let imageExists = await ProductsRepository.findByCode(code)  
        if(imageExists) {
            return res.status(400).json({error: 'Já existe imagem com este código'})
        }

        let imageProduct = await ProductsRepository.create(code, name, size, video)  

        res.json(imageProduct)
    }

    async listImage (req, res) {

        const code = req.params.code

        let imageProduct = await ProductsRepository.findByCode(code)

        if(!imageProduct){
            return res.status(404).json({error: 'Imagem não encontrada'})
        }

        res.json(imageProduct)
    }
    
    async updateImage (req, res) {

        // 1° Verificando se existe imagem na requisição!
        if(!req.file) {
            return res.status(400).json({ error: 'Imagem é requerida'})
        }

        let codeCurrent = Number(req.params.code)
        let { video } = req.body
        let { originalname: name, size}= req.file
        let newCode = Number(name.split('.')[0])
        // 2° Verificando se a imagem a ser modificada existe!
        let imageBD = await ProductsRepository.findByCode(codeCurrent)
        let imageServer = fs.statSync(`./public/upload/imagesProducts/${imageBD.name}`)
        return res.json({imageBD: !imageBD, imageServer: !imageServer})

        if(!imageBD || !imageServer){
            return res.status(404).json({ error: 'Não existe imagem com o código ' + codeCurrent })
        }

        // 3° Verificando se o novo código já está sendo utilizado por imagem diferente a ser atualizada!
        let newCodeExists = await ProductsRepository.findByCode(newCode)

        if(newCodeExists && newCodeExists.code !== codeCurrent) {
            return res.status(400).json({ error: `O código ${newCode} já está sendo utilizado` })
        }
        // 4° Verificando se imagem existe no servidor!
        // try {
        //     let a = fs.statSync(`./public/upload/imagesProducts/${imageBD.name}`)
        //     return res.json(a)
        // }catch {
        //     return res.status(404).json( { error: `Imagem não encontrada no servidor` } )
        // }

        fs.unlinkSync(`./public/upload/imagesProducts/${imageBD.name}`, (err) => {

            if(err) {
                console.log(err)
                return res.status(400).json({ error: `Imagem não atualizada no servidor`})
            }
        })

        let [imageUpdate] = await ProductsRepository.update({ name, codeCurrent, newCode, video, size })

        if(!imageUpdate) {
            res.status(500).json({ error: 'Erro no servidor'})
        }

        res.sendStatus(200)
    }

    async deleteImage (req, res) {
        let code = req.params.code
        let isImage = await ImageProducts.findOne({ where: { code: code }})

        if(isImage){
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
        }else{
            return res.status(400).json({
                error: true,
                message: 'Erro, não existe imagem com o código: ' + code
            })
        }
    }
}

module.exports = new ProductsController()