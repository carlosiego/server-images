const ImageLocations = require('../models/imglocations')

class LocationsRepository {

    async create({ name, size, storehouse, street, side, shelf, column, description, code }) {

        let image = await ImageLocations.create({
            code, name, size, storehouse, street, side, shelf, column, description
        })

        return image;
    }
}

module.exports = new LocationsRepository()