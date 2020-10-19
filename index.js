var express = require("express")

var app = express()

var bp = require('body-parser')

app.use(bp.json())

var jwt = require("jwt-simple")

var moment = require('moment')

// getting-started.js
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});

var lista = new Map()
var users = new Map()

var idActual = 3

var secret = "123456"



var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vestimentas.suaves',
    pass: 'adi-2020'
  }
});



app.post('/login', async function(pet, resp){
    var datos = pet.body
    
    //TODO: cambiar esto por código que genere y envíe un JWT 
    var token = jwt.encode({login:datos.login}, secret)
    resp.send({mensaje:"OK", token:token})
    console.log("Credenciales válidas")
    
})

app.post('/register', async function(pet, resp){
    var nick = pet.body.nick
    var email = pet.body.email
    var nombre = pet.body.nombre
    var password = pet.body.password
    var apellidos = pet.body.apellidos
    var direccion = pet.body.direccion
    var telefono = pet.body.telefono
    
    if(nick&&email&&nombre&&password&&apellidos&&direccion&&telefono){
        var obj = {id:nick, email:email, nombre:nombre, password:password, apellidos:apellidos, direccion:direccion, telefono:telefono}
        users.set(nick, obj)
        resp.send("Usuario creado")

        console.log("Usuario: " + email + " creado")

        var mailOptions = {
            from: 'vestimentas.suaves@gmail.com',
            to: email,
            subject: 'Usuario creado con éxito',
            text: 'Hola ' + nombre + ', tu usario ha sido creado correctamente. Accede con tu nick (' + nick + ') y tu contraseña. Un saludo y muchas gracias.'
        };
        
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
            console.log(error);
            } else {
            console.log('Email sent: ' + info.response);
            }
        });
    }
    
    
})

function isString(x) {
    return Object.prototype.toString.call(x) === "[object String]"
  }

app.get('/users/:id',chequeaJWT, function(pet, resp){
    var id = pet.params.id
    console.log(id)
    if (!isString(id)) {
        resp.status(400)
        resp.send({mensaje:"El dato debe ser numérico"})
    }
    else{
        var dato = users.get(id)
        if (dato){
            resp.status(200)
            resp.send(dato)
            console.log("Usuario " + dato.id)
        }
        else{
            resp.status(404)
            resp.send({mensaje: "Error: no esta en la lista"})
        }
       
    }
})

app.put('/users',chequeaJWT, async function(pet, resp){
    var nick = pet.body.nick
    var email = pet.body.email
    var nombre = pet.body.nombre
    var password = pet.body.password
    var apellidos = pet.body.apellidos
    var direccion = pet.body.direccion
    var telefono = pet.body.telefono
    
    if(nick&&email&&nombre&&password&&apellidos&&direccion&&telefono){
        var obj = {id:nick, email:email, nombre:nombre, password:password, apellidos:apellidos, direccion:direccion, telefono:telefono}
        users.delete(nick)
        users.set(nick, obj)
        resp.send("Usuario modificado")

        console.log("Usuario: " + nick + " creado")
    }else{
        resp.status(400)
        resp.send({mensaje:"falta algún campo"})
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


app.get('/products', function(pet, resp){
    resp.status(200)
    var datos = Array.from(lista.values())
    resp.send(datos)
    console.log("Productos listados")
})

app.get('/products/:id',chequeaJWT, function(pet, resp){
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
            console.log("Producto " + dato.nombre)
        }
        else{
            resp.status(404)
            resp.send({mensaje: "Error: no esta en la lista"})
        }
       
    }
})

app.post('/products', chequeaJWT, function(pet, resp){
    var nombre = pet.body.nombre
    var precio = pet.body.precio
    var tallas = pet.body.tallas
    var colores = pet.body.colores
    var marca = pet.body.marca
    if(nombre&&precio&&tallas&&colores&&marca){
        var obj = {id:idActual, nombre:nombre, precio:precio, tallas:tallas, colores:colores, marca:marca}
        lista.set(idActual, obj)
        resp.status(201)
        resp.setHeader('Location', 'http://localhost:3000/products/'+idActual)
        resp.send("Objeto creado")
        console.log("Nuevo producto " + nombre)
    }
    else{
        resp.status(400)
        resp.send({mensaje:"falta algún campo"})
    }
})

app.delete('/products/:id', chequeaJWT, function(pet, resp){
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
            console.log("Producto borrado " + dato.nombre)
        }
        else{
            resp.status(404)
            resp.send({mensaje: "Error: no esta en la lista"})
        }
    }
})

app.put('/products', chequeaJWT, function(pet, resp){
    var nombre = pet.body.nombre
    var precio = pet.body.precio
    var tallas = pet.body.tallas
    var colores = pet.body.colores
    var marca = pet.body.marca
    var id = pet.body.id
    if(nombre&&precio&&tallas&&colores&&marca&&id){
        var obj = {id:id, nombre:nombre, precio:precio, tallas:tallas, colores:colores, marca:marca}
        lista.delete(parseInt(id))
        lista.set(id, obj)
        resp.status(201)
        resp.setHeader('Location', 'http://localhost:3000/products/'+idActual)
        idActual++
        resp.send("Producto modificado")
        console.log("Producto modificado " + nombre)
    }
    else{
        resp.status(400)
        resp.send({mensaje:"falta algún campo"})
    }
})

app.listen(3000, function(){
    console.log("Servidor cosiendo en el 3000...")
    lista.set(1, {id:1, nombre:"camiseta manga corta", precio:10, tallas:["M","L"], colores:["rojo","azul"], marca:"Adidas"})
    lista.set(2, {id:2, nombre:"pantalón corto", precio:15, tallas:["S","L"], colores:["verde","azul"], marca:"Nike"})
})