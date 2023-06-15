const ImageLocations = require('../models/imglocations')

class LocationsRepository {

    async create({ name, size, storehouse, street, side, shelf, column, description, code }) {

        let image = await ImageLocations.create({
            code, name, size, storehouse, street, side, shelf, column, description
        })

        return image;
    }

    async findByCode({ code }) {

        let images = await ImageLocations.findAll({ where: { code }})

        return images;
    }

    async findByName({ name }) {
        
        let image = await ImageLocations.findOne({ where: { name }})

        return image;
    }

    async update({ nameCurrent, newName, code, size, storehouse, street, side, shelf, column, description }) {

        let image = await ImageLocations.update(
            {
                name: newName,
                size,
                storehouse: storehouse || undefined,
                street: street || undefined,
                side: side || undefined,
                shelf: shelf || undefined,
                column: column || undefined,
                description: description || undefined,
                code
            },
            { where: { name: nameCurrent } })

        return image;
    }

    async updateAll({ nameCurrent, code, storehouse, street, side, shelf, column, description }) {

        let image = await ImageLocations.update(
            {
                storehouse: storehouse || undefined,
                street: street || undefined,
                side: side || undefined,
                shelf: shelf || undefined,
                column: column || undefined,
                description: description || undefined,
                code
            },
            { where: { name: nameCurrent } })

        return image;
    }
}

module.exports = new LocationsRepository()