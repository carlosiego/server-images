const Sequelize = require('sequelize')

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
	host: process.env.DB_HOST,
	dialect: 'mysql',
	timezone: '-03:00'

})

sequelize.authenticate()
	.then(() => {
		console.log('Conexão com o banco de dados realizada com sucesso!')
	}).catch(() => {
		console.log('Erro: Conexão com o banco de dados não realizada!')

	})

module.exports = sequelize
