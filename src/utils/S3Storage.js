const aws = require('aws-sdk')
const { S3 } = require('aws-sdk')
const path = require('path')
const mime = require('mime')
const fs = require('fs')

class S3Storage {

	constructor() {
		this.client = new aws.S3({
			region: 'us-east-1'
		})
	}

	async saveFile(filename) {
		const originalPath = path.resolve(dirname, "..", "folderTmp")

		const ContentType = mime.getType(originalPath)

		if (!ContentType) throw new Error('File not Found')

		const fileContent = await fs.promises.readFile(originalPath)

		this.client.putObject({
			Bucker: 'nãosei',
			Key: filename,
			ACL: 'public-read',
			Body: fileContent,
			ContentType
		})
			.promise();

		await fs.promises.unlink(originalPath)

	}

}
