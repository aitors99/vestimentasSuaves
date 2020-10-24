
const express = require('express')
const productModel = require('../models/product')
const productService = require('../services/product.service')

var jwt = require("jwt-simple")

const router = express.Router()

var secret = "123456"

function isString(x) {
    return Object.prototype.toString.call(x) === "[object String]"
  }

router.get('/products', async function(pet, resp){
    try{
        const datos = await productService.readProducts()
        resp.status(200)
        resp.send(datos)
    }catch(err){
        resp.status(500).send({message:err.message})
    }
    
})

router.get('/products/:id',chequeaJWT, async function(pet, resp){
    var id = pet.params.id
    if (!isString(id)) {
        resp.status(400)
        resp.send({mensaje:"Error: El nick debe ser una cadena de caracteres"})
    }
    else{
        try{
            const datos = await productService.readProduct(id)
        
            if (datos.length!=0){
                resp.status(200)
                resp.send(datos)
            }
            else{
                resp.status(404)
                resp.send({mensaje: "Error: No esta en la lista"})
            }
        }catch(err){
            resp.status(500).send({message:err.message})
        }
    }
})

router.post('/products', chequeaJWT,async function(pet, resp){
    
    var nombre = pet.body.nombre
    var precio = pet.body.precio
    var talla = pet.body.talla
    var color = pet.body.color
    var marca = pet.body.marca
    
    if(nombre&&precio&&talla&&color&&marca){

        try {
            const product = await productService.createProduct(nombre, precio, talla, color, marca)
            resp.status(201)
            resp.setHeader('Location', 'http://localhost:3000/products/'+product._id)
            resp.send(product)
            
        }catch(err){
            resp.status(500)
            resp.send({message:err.message})
        }
        
    }
    else{
        resp.status(400)
        resp.send({mensaje:"Error: Falta algún campo: nombre, precio, talla, color o marca"})
    }
})

router.delete('/products/:id', chequeaJWT, async function(pet, resp){
    var id = pet.params.id
    if (!isString(id)) {
        resp.status(400)
        resp.send({mensaje:"El dato debe ser numérico"})
    }
    else{
        try{
            const product = await productService.deleteProduct(id)
            if (product.length!=0){
                resp.status(204)
            }
            else{
                resp.status(404)
                resp.send({mensaje: "Error: no esta en la lista"})
            }
        }catch(err){
            resp.status(500)
            resp.send({message:err.message})
        }
    }
})

router.put('/products/:id', chequeaJWT, async function(pet, resp){
    var nombre = pet.body.nombre
    var precio = pet.body.precio
    var tallas = pet.body.tallas
    var colores = pet.body.colores
    var marca = pet.body.marca4
    var id = pet.params.id
    if(nombre&&precio&&tallas&&colores&&marca&&id){
        try{
            const product = await productService.modifyProduct(id, pet.body)
            if(product.length!=0){
                resp.status(204)
                resp.setHeader('Location', 'http://localhost:3000/products/'+id)
                resp.send(product)
            }else{
                resp.status(404)
                resp.send({mensaje: "Error: no esta en la lista"})
            }
        }catch(err){
            resp.status(500)
            resp.send({message:err.message})
        }
    }
    else{
        resp.status(400)
        resp.send({mensaje:"Error: Falta algún campo: nombre, precio, talla, color o marca"})
    }
})

//Middleware: lo pondremos ANTES de procesar la petición
function chequeaJWT(pet, resp, next) {
    var tokenOK  = false

    var cabecera = pet.header('Authorization')
    //Parte el string por el espacio. Si está, devolverá un array de 2
    //la 2ª pos será lo que hay detrás de "Bearer"
    if(cabecera){
        var campos = cabecera.split(' ')
        if (campos.length>1 && cabecera.startsWith('Bearer')) {
            var token = campos[1]
            //TODO: con jwt-simple decodificar el token. 
            var decoded = jwt.decode(token, secret)
            //si tiene éxito poner tokenOK=true 
            if(decoded) tokenOK = true
        }
    }
    
    
    if (tokenOK) {
        //Al llamar a next, el middleware "deja pasar" a la petición
        //llamando al siguiente middleware
        console.log("Usuario autorizado")
        next()
    }
    else {
        resp.status(403)
        resp.send({mensaje: "no tienes permisos"})
    }
}

module.exports = router