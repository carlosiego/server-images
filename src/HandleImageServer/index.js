const ProductsRepository = require('../repositories/ImgProductsRepository')
const fs = require('fs')
const path = require('path')


class HandleImageServer {

    getLatestImage(directoryPath) {
        const images = fs.readdirSync(directoryPath)

        if (images.length === 0) {
            return null;
        }

        const sortedImages = images.map((fileName) => ({
            name: fileName,
            modifiedTime: fs.statSync(path.join(directoryPath, fileName)).mtime.getTime()
        })).sort((a, b) => b.modifiedTime - a.modifiedTime);

        return sortedImages[0].name
    }

    async deleteImage({ dir, filename }) {

        try {
            fs.unlinkSync(path.resolve(__dirname, '..', '..', 'uploads', dir, filename))
        } catch {
            let lastImage = this.getLatestImage(path.resolve(__dirname, '..', '..', 'uploads', dir))
            if (lastImage) {
                let lastImagePath = path.resolve(__dirname, '..', '..', 'uploads', dir, lastImage)
                let imageExistsBD = await ProductsRepository.findByName(lastImage)

                if (!imageExistsBD) {
                    try {
                        fs.unlinkSync(lastImagePath)
                    } catch (error) {
                        console.log(error)
                    }
                }
            }
        }
    }
}

module.exports = new HandleImageServer()
