const app = require('./app.js')


app.listen(process.env.PORT, () => {
    console.log(`Servidor escutando em http://${process.env.SERVER_ADRESS}:${process.env.PORT}`)
})

