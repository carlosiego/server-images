const getLatestFile = require('./getLatestFile')
const ProductsRepository = require('../repositories/ProductsRepository')
const fs = require('fs')
const path = require('path')

async function deleteImageServer({ dir, filename }){

    try{
        fs.unlinkSync(path.resolve(__dirname, '..', '..', 'public', 'upload', dir , filename))
    }catch{
        let lastImage = getLatestFile(path.resolve(__dirname, '..', '..', 'public', 'upload', dir ))
        if(lastImage) {
            let lastImagePath = path.resolve(__dirname, '..', '..', 'public', 'upload', dir , lastImage)
            let imageExistsBD = await ProductsRepository.findByName(lastImage)
            
            if(!imageExistsBD){
                try{
                    fs.unlinkSync(lastImagePath)
                }catch (error) {
                    console.log(error)
                }
            }
        }
    }
}

module.exports = deleteImageServer