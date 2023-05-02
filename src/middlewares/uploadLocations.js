const multer = require('multer')

module.exports = (multer({
    storage: multer.diskStorage({
        destination: ( req, file, cb) => {
            cb(null, './public/upload/imagesLocations')
        },
        filename: (req, file, cb) => {
            cb(null, 'loc_' + String(file.originalname))
        }
    }),
    fileFilter: (req, file, cb) => {
        const extensionImg = ['image/png', 'image/jpg', 'image/jpeg'].find(acceptedFormat => acceptedFormat == file.mimetype)

        if(extensionImg){
            return cb(null, true)
        }

        return cb(null, false)
    }
}))