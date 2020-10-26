
const express = require('express')
const productService = require('../services/product.service')

var jwt = require("jwt-simple")

const fs = require('fs')

const router = express.Router()

var secret = "123456"

var multer = require('multer')

var newName = ""

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './assets')
    },
    filename: (req, file, cb) => {
        newName = Date.now() + '-' + file.originalname
      cb(null, newName)
    }
});
var upload = multer({storage: storage});


function isString(x) {
    return Object.prototype.toString.call(x) === "[object String]"
  }

router.get('/products', async function(pet, resp){
    const page = parseInt(pet.query.page)
    const limit = parseInt(pet.query.limit)

    if(page == 0) page = 1

    const startIndex = (page - 1) * limit
    const endIndex = page * limit 

    const results = {}
    
    try{
        const datos = await productService.readProducts(limit, startIndex)
        
    
        if(startIndex > 0){
            results.previous = {
                page: page - 1,
                limit: limit
            }
        }

        if(endIndex < await productService.getLentgh()){
            results.next = {
                page: page +1,
                limit: limit
            }
        }

        results.products = datos

        resp.status(200)
        resp.send(results)
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
            const dato = await productService.readProduct(id)
            if (dato!=null){
                resp.status(200)
                resp.send(dato)
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

router.post('/products', upload.single('productImage'), chequeaJWT, async function(pet, resp){
    
    var nombre = pet.body.nombre
    var precio = pet.body.precio
    var talla = pet.body.talla
    var color = pet.body.color
    var marca = pet.body.marca
    var filePath = pet.file.filename
    if(nombre&&precio&&talla&&color&&marca&&filePath){

        try {
            const product = await productService.createProduct(nombre, precio, talla, color, marca, filePath)
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
        resp.send({mensaje:"Error: Falta algún campo: nombre, precio, talla, color, marca o imagen"})
    }
})

router.delete('/products/:id', chequeaJWT, async function(pet, resp){
    var id = pet.params.id
    if (id.length!=24) {
        resp.status(400)
        resp.send({mensaje:"Error: El id debe ser una cadena de 24 caracteres"})
    }
    else{
        try{
            const product = await productService.deleteProduct(id)
            if (product!=null){
                resp.status(204).send(product)
            }
            else{
                resp.status(404)
                resp.send({mensaje: "Error: No esta en la lista"})
            }
        }catch(err){
            
            resp.status(500)
            resp.send({message:err.message})
            
        }
    }
})

router.put('/products/:id', upload.single('productImage'), chequeaJWT, async function(pet, resp){
    var nombre = pet.body.nombre
    var precio = pet.body.precio
    var talla = pet.body.talla
    var color = pet.body.color
    var marca = pet.body.marca
    var id = pet.params.id
    if(id.length==24){
        if(nombre&&precio&&talla&&color&&marca&&id){
            try{
                const product = await productService.modifyProduct(id, pet.body, newName)
                if(product!=null){
                    resp.status(204)
                    resp.setHeader('Location', 'http://localhost:3000/products/'+id)
                    resp.send(product)
                }else{
                    resp.status(404)
                    fs.unlinkSync('./assets/'+newName)
                    resp.send({mensaje: "Error: no esta en la lista"})
                }
            }catch(err){
                resp.status(500)
                resp.send({message:err.message})
            }
        }
        else{
            resp.status(400)
            fs.unlinkSync('./assets/'+newName)
            resp.send({mensaje:"Error: Falta algún campo: nombre, precio, talla, color, marca o imagen"})
        }
    }else{
        resp.status(400)
        fs.unlinkSync('./assets/'+newName)
        resp.send({mensaje:"Error: El id debe ser una cadena de 24 caracteres"})
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