const ImageLocations = require('../models/imglocations')
const fs = require('fs')

class imagesLocationsController {

    
// ========================= CREATE ====================================================================================    

    static uploadImageLocations = async (req, res) => {
        if(req.file){
            let { storehouse, street, side, shelf, column, description } = req.body       
            let code = Number(req.file.originalname.split('.')[0])
            await ImageLocations.create({
                code,
                name: 'loc_' + req.file.originalname,
                size: req.file.size,
                storehouse,
                street,
                side,
                shelf,
                column,
                description
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

    static getImageLocations = async (req, res) => {
       let code = req.params.code
       await ImageLocations.findOne({ where: {code: code}})
       .then((image) => {
            return res.json({
                error: false,
                image,
                url: `http://${process.env.SERVER_ADRESS}:${process.env.PORT}/files/imagesLocations/${image.name}`
            })
       }).catch(() => {
            return res.status(400).json({
                error: true,
                message: 'Não existe imagem com o código ' + code,
                url: `http://${process.env.SERVER_ADRESS}:${process.env.PORT}/files/not-found.png`
            })
       })
    }

// ========================= UPDATE ====================================================================================    

    static changeImageLocations = async (req, res) => {

        let codeCurrent = req.params.code
        let { code, storehouse, street, side, shelf, column, description } = req.body

        let isImage = await ImageLocations.findOne({ where: {code: codeCurrent}})
        if(isImage){
            let name = 'loc_' + code + '.' + (isImage.name.split(".")[1] ? isImage.name.split(".")[1] : 'png')
            await ImageLocations.update(
                { code: code, 
                  name: name,
                  storehouse: storehouse || undefined,
                  street: street || undefined,
                  side: side || undefined,
                  shelf: shelf || undefined,
                  column: column || undefined,
                  description: description || undefined,
                 },
                { where: { code: codeCurrent } })
                .then(() => {
                    fs.rename(
                        `./public/upload/imagesLocations/${isImage.name}`, 
                        `./public/upload/imagesLocations/${name}`, 
                        (err) => {
                            if(err){
                                res.status(400).json({
                                    error: true,
                                    message: 'Erro, não foi possível alterar o nome da imagem no disco!'
                                })
                            }else {
                                res.status(201).json({
                                    error: false,
                                    message: 'Modificação realizada com sucesso!',

                                })
                            }
                        }
                    )
                }).catch(() => {
                    return res.status(400).json({
                        error: true,
                        message: `Erro, já existe imagem com o código ${code}!`
                    })
                })
        }else {
            res.status(400).json({
                error: true,
                message: 'Não existe imagem com este código: ' + codeCurrent
            })
        }
    }
    
// ========================= DELETE ====================================================================================    

    static deleteImageLocations = async (req, res) => {
        let code = req.params.code
        let isImage = await ImageLocations.findOne({ where: { code }})
        
        if(isImage){
            await ImageLocations.destroy( { where : { code } } )
            .then(() => {
                fs.unlinkSync(`./public/upload/imagesLocations/${isImage.name}`)
                return res.json({
                    error: false,
                    message: 'Imagem excluída com sucesso!'
                })
            }).catch(() => {
                return res.json({
                    error: true,
                    message: 'Erro, não foi possível excluir a imagem com o código ' + code
                })
            })
        }else{
            return res.json({
                error: true,
                message: 'Não existe imagem com o código ' + code
            })
        }
    }

}

module.exports = imagesLocationsController