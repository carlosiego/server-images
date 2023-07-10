const multer = require('multer')

const fileFilter = multer({
		fileFilter: (req, file, cb) => {
			const allowedMimes = ['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)
			if (allowedMimes) {
				cb(null, true)
			} else {
				cb(new Error('O arquivo enviado não é uma imagem válida.'));
			}
		}
});

module.exports = fileFilter
