const LocationsRepository = require('../repositories/LocationsRepository')
const HandleImageServer = require('../HandleImageServer/index')

class LocationsController {

    async createImage(req, res) {

        if (!req.file) return res.status(400).json({ error: 'Imagem é requerida' })

        let { code, storehouse, street, side, shelf, column, description } = req.body
        let { size, filename: name } = req.file
        code = Number(code)
        if (typeof code !== 'number') {
            await HandleImageServer.deleteImage({ dir: process.env.DIR_IMAGES_LOCATIONS, filename: name })
            return res.json({ error: `O código tem que ser do tipo número` })
        }

        if (!code) {
            await HandleImageServer.deleteImage({ dir: process.env.DIR_IMAGES_LOCATIONS, filename: name })
            return res.json({ error: `Código é requerido` })
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

        let images = await LocationsRepository.findByCode(code)
        let imagesWithPath = []

        if (images) {
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
        code = Number(code)
 
        // 1° Verificando se o código é do tipo número
        if (isNaN(code)) {
            if (req.file) await HandleImageServer.deleteImage({ dir: process.env.DIR_IMAGES_LOCATIONS, filename: req.file.filename })

            return res.status(400).json({ error: `Código tem que ser do tipo número` })
        }

        let imageExists = await LocationsRepository.findByName(nameCurrent)
        // 2° Verificando se a imagem existe no banco de dados
        if (!imageExists) {
            if (req.file) await HandleImageServer.deleteImage({ dir: process.env.DIR_IMAGES_LOCATIONS, filename: req.file.filename })
            return res.status(400).json({ error: `Imagem com o nome ${nameCurrent} não existe` })
        }

        let imageUpdated;
        // 3° Verificando se o update tem imagem, se sim atualize a imagem no disco
        if (req.file) {
            let { filename, size } = req.file
            await HandleImageServer.deleteImage({ dir: process.env.DIR_IMAGES_LOCATIONS, filename: imageExists.name})
            imageUpdated = await LocationsRepository.updateAll({
                nameCurrent, filename, code, size, storehouse, street, side, shelf, column, description
            })
        }else {
            imageUpdated = await LocationsRepository.update({
                nameCurrent, code, storehouse, street, side, shelf, column, description
            })
        }

        if (!imageUpdated) return res.status(400).json({ error: 'Não foi possivel atualizar imagem' })

        return res.sendStatus(200)

    }

    async deleteImage(req, res) {

        let { name } = req.params
        
        let image = await LocationsRepository.findByName(name)

        if(!image) return res.status(400).json({error: 'Não existe imagem com o nome ' + name})

        Promise.all([
            LocationsRepository.deleteByName(name),
            HandleImageServer.deleteImage({ dir: process.env.DIR_IMAGES_LOCATIONS, filename: name})
        ])
            
        res.sendStatus(200)

    }

}

module.exports = new LocationsController()
