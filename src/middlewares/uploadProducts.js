const multer = require('multer')
const path = require('path')
const { v4 } = require('uuid')

const isLinux = process.platform === 'linux'
const pathLinux = path.resolve(__dirname, '..', '..', 'uploads', process.env.DIR_IMAGES_PRODUCTS) // SISTEMA DE PRODUÇÃO
const pathWindows = path.resolve('C:', 'uploads', process.env.DIR_IMAGES_PRODUCTS) // SISTEMA DE DESENVOLVIMENTO

const uploadProducts = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, (isLinux ? pathLinux : pathWindows));

    },

    filename: (req, file, cb) => {
      cb(null, v4() + '-' + file.originalname);
    },
  })

});

module.exports = uploadProducts
