const ImageLocations = require('../models/imglocations')
const LocationsRepository = require('../repositories/LocationsRepository')
const HandleImageServer = require('../HandleImageServer/index')
const fs = require('fs')

class LocationsController {

    async createImage(req, res) {

        if (!req.file) return res.status(400).json({ error: 'Imagem é requerida' })
    
        
        let { code, storehouse, street, side, shelf, column, description } = req.body
        let { size, filename: name } = req.file

        if(typeof code !== 'number'){ 
            await HandleImageServer.deleteImage({ dir: process.env.DIR_IMAGES_LOCATIONS, filename: name })
            return res.json({ error: `O código tem que ser do tipo número`})
        }

        if (!code) {
            await HandleImageServer.deleteImage({ dir: process.env.DIR_IMAGES_LOCATIONS, filename: name })
            return res.status(400).json({ error: 'Codigo é requerido' })

        } 
        if (!storehouse) {
            await HandleImageServer.deleteImage({ dir: process.env.DIR_IMAGES_LOCATIONS, filename: name })
            return res.status(400).json({ error: 'Localidade é requerida' })
        }

        let imageUpdated = await LocationsRepository.create({ name, size, storehouse, street, side, shelf, column, description, code })

        if (!imageUpdated) {
            await HandleImageServer.deleteImage({ dir: process.env.DIR_IMAGES_LOCATIONS, filename: name })
            return res.status(400).json({ error: 'Imagem não criada' })
        } 
        
        return res.json(imageUpdated)
    }

    async listImages(req, res) {

        let { code } = req.params

        let images = await LocationsRepository.findByCode({ code })
        let imagesWithPath = []

        if(images){
            imagesWithPath = images.map(image => ({
                ...image.dataValues,
                path: `http://${process.env.SERVER_ADDRESS}:${process.env.PORT}/files/${process.env.DIR_IMAGES_LOCATIONS}/${image.name}`            
            }));
        }

        return res.json(imagesWithPath)

    }

    async updateImage(req, res) {

        let { name: nameCurrent } = req.params
        let { code, storehouse, street, side, shelf, column, description } = req.body

        if(typeof code !== 'number') {
            if(req.file) await HandleImageServer({ dir: process.env.DIR_IMAGES_LOCATIONS, filename: req.file.filename})
            return res.status(400).json({error: 'Código é requerido'})
        }

        let imageExists = await LocationsRepository.findByName({ name })

        if(!imageExists) {
            if(req.file) await HandleImageServer({ dir: process.env.DIR_IMAGES_LOCATIONS, filename: req.file.filename})
            return res.status(400).json({error: `Imagem com o nome ${name} não existe`})
        }

        let imageUpdated;

        if(req.file){
            let { size, filename: newName } = req.file
            imageUpdated = await LocationsRepository.updateAll({
                nameCurrent, newName, code, size, storehouse, street, side, shelf, column, description
            })
        }

        imageUpdated = await LocationsRepository.update({
            name, code, storehouse, street, side, shelf, column, description
        })


    }

    // ========================= DELETE ====================================================================================    

    async deleteImage(req, res) {
        let code = req.params.code
        let isImage = await ImageLocations.findOne({ where: { code } })

        if (isImage) {
            await ImageLocations.destroy({ where: { code } })
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
        } else {
            return res.json({
                error: true,
                message: 'Não existe imagem com o código ' + code
            })
        }
    }

}

module.exports = new LocationsController()