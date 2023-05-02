const ImageProducts = require('../models/imgproducts')
const fs = require('fs')

class imagesProductsController {

// ========================= CREATE ====================================================================================    

    static uploadImageProducts = async (req, res) => {
        if(req.file) {
            let code = Number(req.file.originalname.split('.')[0])
            let { video } = req.body

            await ImageProducts.create({ 
                code,
                name: req.file.originalname,
                size: req.file.size,
                video
            })
            .then(() => {
                return res.status(201).json({
                    error: false,
                    message: 'Upload realizado com sucesso!'
                })
            })
            .catch(() => {
                return res.status(400).json({
                    error: true,
                    message: "Erro, já existe imagem com o mesmo código!"
                })
            })
        }else {
            return res.status(400).json({
                error: true,
                message: 'Erro: Upload não realizado, necessário que o arquivo seja do tipo PNG ou JPG!'
            })
        }
    }

// ========================= READ ====================================================================================    

    static getImageProducts = async (req, res) => {
        const code = req.params.code
        await ImageProducts.findOne({ where: { code: code } })
        .then((image) => {
            return res.json({
                error: false,
                image,
                urlImage: `http://${process.env.SERVER_ADRESS}:${process.env.PORT}/files/imagesProducts/${image.name}`,
                urlVideo: image.video
            })
        }).catch(() => {
            return res.status(400).json({
                error: true,
                message: 'Não existe imagem com o código: ' + code,
                urlImage: `http://${process.env.SERVER_ADRESS}:${process.env.PORT}/files/not-found.png`
            })
        })
    }

// ========================= UPDATE ====================================================================================    
    
    static changeImageProducts = async (req, res) => {
        const codeCurrent = req.params.code
        let { code, video } = req.body
        console.log(video)
        let isImage = await ImageProducts.findOne({ where: { code: codeCurrent}})
        if(isImage){
            let name = code + '.' + (isImage.name.split(".")[1] ? isImage.name.split(".")[1] : 'png')
            await ImageProducts.update(
                { 
                  name,
                  code,
                  video: video || undefined
                }, 
                { where: { code: codeCurrent }}
            )
            .then(() => {
                fs.rename(
                    `./public/upload/imagesProducts/${isImage.name}`, 
                    `./public/upload/imagesProducts/${name}`,
                    (err) => {
                        if(err){
                            res.status(400).json({
                                error: true,
                                message: 'Erro, não foi possível alterar o nome da imagem no disco'
                            })
                        }else{
                            res.status(201).json({
                                error: false,
                                message: 'Upload feito com sucesso',
                            })
                        }
                    }
                )
            }).catch(() => {
                res.status(400).json({
                    error: true,
                    message: `Erro, já existe imagem com o código ${code}!`
                })
            })
        }else {
            res.status(400).json({
                error: true,
                message: 'Erro, não existe imagem com o código: ' + codeCurrent
            })
        }
    }

// ========================= DELETE ====================================================================================    

    static deleteImageProducts = async (req, res) => {
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

module.exports = imagesProductsController