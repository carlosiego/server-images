const multer = require('multer')
const path = require('path')


const uploadProducts = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, '..', '..', 'public', 'upload', 'imagesProducts'));

    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)
    if (allowedMimes) {
      cb(null, true)
    } else {
      cb(new Error('O arquivo enviado não é uma imagem válida.'));
    }
  }


});

module.exports = uploadProducts

// {    dest: path.resolve(__dirname, '..', '..', 'public', 'upload', 'imagesProducts'),
//     storage: multer.memoryStorage(),
//     fileFilter: (req, file, cb) => {
//         const allowedMimes = ['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)

//         if (allowedMimes) {
//             cb(null, true)
//         } else {
//             cb(new Error("Invalid file type."))
//         }
//     }
// }
// // {
// //     filename: (req, file, cb) => {
// //         cb(null, file.filename)
// //     },
// //     destination: (req, file, cb) => {
// //         cb(null, path.resolve(__dirname, '..', '..', 'public', 'upload', 'imagesProducts'))
// //     },
// // }