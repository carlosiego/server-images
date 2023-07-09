// const multer = require('multer')
// const path = require('path')
// const { v4 } = require('uuid')

// const uploadProducts = multer({
//   storage: multer.diskStorage({
//     filename: (req, file, cb) => {
//       cb(null, v4() + '-' + file.originalname);
//     },
//   }),
//   fileFilter: (req, file, cb) => {
//     const allowedMimes = ['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)
//     if (allowedMimes) {
//       cb(null, true)
//     } else {
//       cb(new Error('O arquivo enviado não é uma imagem válida.'));
//     }
//   }


// });

// module.exports = uploadProducts
