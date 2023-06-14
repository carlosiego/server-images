const path = require('path')
const fs =  require('fs')

function getLatestFile(directoryPath) {
    const files = fs.readdirSync(directoryPath)

    if (files.length === 0) {
        return null;
    }
    
    const sortedFiles = files.map((fileName) => ({
        name: fileName,
        modifiedTime: fs.statSync(path.join(directoryPath, fileName)).mtime.getTime() 
    })).sort((a, b) => b.modifiedTime - a.modifiedTime);

    return sortedFiles[0].name
}

module.exports = getLatestFile