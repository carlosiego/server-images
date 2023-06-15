const ImageLocations = require('../models/imglocations')
const LocationsRepository = require('../repositories/LocationsRepository')
const fs = require('fs')

class LocationsController {


    // ========================= CREATE ====================================================================================    

    async createImage(req, res) {

        if (!req.file) return res.status(400).json({ error: 'Imagem é requerida' })


        let { code, storehouse, street, side, shelf, column, description } = req.body
        let { size, originalname: name } = req.file

        if (!code) return res.status(400).json({ error: 'Codigo é requerido' })

        // puxar outra tabela pra procurar por cod


        let imageUpdated = await LocationsRepository.create({ name, size, storehouse, street, side, shelf, column, description, code })

        return res.json('kk')
    }

    // ========================= READ ====================================================================================    

    async listImage(req, res) {
        let code = req.params.code
        await ImageLocations.findOne({ where: { code: code } })
            .then((image) => {
                return res.json({
                    error: false,
                    image,
                    url: `http://${process.env.SERVER_ADDRESS}:${process.env.PORT}/files/imagesLocations/${image.name}`
                })
            }).catch(() => {
                return res.status(400).json({
                    error: true,
                    message: 'Não existe imagem com o código ' + code,
                    url: `http://${process.env.SERVER_ADDRESS}:${process.env.PORT}/files/not-found.png`
                })
            })
    }

    // ========================= UPDATE ====================================================================================    

    async updateImage(req, res) {

        let codeCurrent = req.params.code
        let { code, storehouse, street, side, shelf, column, description } = req.body

        let isImage = await ImageLocations.findOne({ where: { code: codeCurrent } })
        if (isImage) {
            let name = 'loc_' + code + '.' + (isImage.name.split(".")[1] ? isImage.name.split(".")[1] : 'png')
            await ImageLocations.update(
                {
                    code: code,
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
                            if (err) {
                                res.status(400).json({
                                    error: true,
                                    message: 'Erro, não foi possível alterar o nome da imagem no disco!'
                                })
                            } else {
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
        } else {
            res.status(400).json({
                error: true,
                message: 'Não existe imagem com este código: ' + codeCurrent
            })
        }
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