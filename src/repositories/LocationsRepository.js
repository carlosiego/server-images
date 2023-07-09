const ImageLocations = require('../models/tables/imglocations')

class LocationsRepository {

    async create({ name, size, storehouse, street, side, shelf, column, description, code }) {

        let image = await ImageLocations.create({
            code, name, size, storehouse, street, side, shelf, column, description
        })

        return image;
    }

    async findByCode(code) {

        let images = await ImageLocations.findAll({ where: { code } })

        return images;
    }

    async findByName(name) {

        let image = await ImageLocations.findOne({ where: { name } })

        return image;
    }

    async update({ nameCurrent, code, storehouse, street, side, shelf, column, description }) {

        let image = await ImageLocations.update(
            {
                storehouse: storehouse || undefined,
                street: street,
                side: side,
                shelf: shelf,
                column: column,
                description: description,
                code: code || undefined
            },
            { where: { name: nameCurrent } })

        return image;
    }

    async updateAll({ nameCurrent, filename, code, size, storehouse, street, side, shelf, column, description }) {

        let image = await ImageLocations.update(
            {
                name: filename,
                size,
                storehouse: storehouse || undefined,
                street: street,
                side: side,
                shelf: shelf,
                column: column,
                description: description,
                code: code || undefined
            },
            { where: { name: nameCurrent } })

        return image;
    }

    async deleteByName(name) {

        await ImageLocations.destroy({ where: { name } })

    }
}

module.exports = new LocationsRepository()