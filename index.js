var express = require('express')
var mongoose = require('mongoose')
var userRouter = require('./routes/userRoutes')
var productRouter = require('./routes/productsRoutes')
var cors = require('cors')
var morgan = require('morgan')

var bp = require('body-parser')
var app = express()
app.use(bp.json())
app.use(morgan("tiny"))

app.use(cors({exposedHeaders: ['Location']})) //añadir parámetro 



mongoose.connect('mongodb+srv://prueba:Batminion03@cluster0.p1m24.gcp.mongodb.net/adi?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true })

app.use(userRouter)
app.use(productRouter)
mongoose.set('useFindAndModify', false)

app.listen(3000, function(){
    console.log("Servidor cosiendo en el 3000...")
    /*lista.set(1, {id:1, nombre:"camiseta manga corta", precio:10, tallas:["M","L"], colores:["rojo","azul"], marca:"Adidas"})
    lista.set(2, {id:2, nombre:"pantalón corto", precio:15, tallas:["S","L"], colores:["verde","azul"], marca:"Nike"})*/
})









//var moment = require('moment')



















