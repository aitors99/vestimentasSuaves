var express = require("express")

var app = express()

var bp = require('body-parser')

app.use(bp.json())

var lista = new Map()

var idActual = 2

app.get('/products', function(pet, resp){
    resp.status(200)
    var datos = Array.from(lista.values())
    resp.send(datos)
})

app.get('/products/:id', function(pet, resp){
    var id = parseInt(pet.params.id)
    if (isNaN(id)) {
        resp.status(400)
        resp.send({mensaje:"El dato debe ser numérico"})
    }
    else{
        var dato = lista.get(id)
        if (dato){
            resp.status(200)
            resp.send(dato)
        }
        else{
            resp.status(404)
            resp.send({mensaje: "Error: no esta en la lista"})
        }
       
    }
})

app.post('/products', function(pet, resp){
    var nombre = pet.body.nombre
    var precio = pet.body.precio
    var tallas = pet.body.tallas
    var colores = pet.body.colores
    var marca = pet.body.marca
    if(nombre&&precio&&tallas&&colores&&marca){
        var obj = {id:idActual, nombre:nombre, precio:precio, tallas:tallas, colores:colores, categoria:categoria}
        lista.set(idActual, obj)
        resp.status(201)
        resp.setHeader('Location', 'http://localhost:3000/items/'+idActual)
        idActual++
        resp.send("Objeto creado")
    }
    else{
        resp.status(400)
        resp.send({mensaje:"falta algún campo campo nombre"})
    }
})

app.delete('/products/:id', function(pet, resp){
    var id = parseInt(pet.params.id)
    if (isNaN(id)) {
        resp.status(400)
        resp.send({mensaje:"El dato debe ser numérico"})
    }
    else{
        var dato = lista.get(id)
        if (dato){
            lista.delete(id)
            resp.status(200)
            resp.send(dato)
        }
        else{
            resp.status(404)
            resp.send({mensaje: "Error: no esta en la lista"})
        }
    }
})

app.listen(3000, function(){
    console.log("Servidor cosiendo en el 3000...")
    lista.set(1, {id:1, nombre:"camiseta manga corta", precio:10, tallas:["M","L"], colores:["rojo","azul"], marca:"Adidas"})
    lista.set(2, {id:2, nombre:"pantalón corto", precio:15, tallas:["S","L"], colores:["verde","azul"], marca:"Nike"})
})