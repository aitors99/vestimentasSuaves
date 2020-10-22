


const express = require('express')
var nodemailer = require('nodemailer')
const userService = require('../services/user.service')

var jwt = require("jwt-simple")


const router = express.Router()

var secret = "123456"


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vestimentas.suaves',
    pass: 'adi-2020'
  }
});

router.post('/login',  async function(pet, resp){
    var datos = pet.body
    
    try{
        
       var credentials = userService.getPassword(pet.body.id, pet.body.password)
        

        if(credentials){
            //TODO: cambiar esto por código que genere y envíe un JWT 

            var token = jwt.encode({login:datos.login}, secret)
            resp.send({mensaje:"OK", token:token})
            console.log("Credenciales válidas")
        }else{
            resp.send({mensaje:"Credenciales inválidas"})
            console.log("Credenciales inválidas")
        }
    }catch(err){
        resp.send({mensaje:err})
        console.log(err)
    }
    
    
    
})

router.post('/register', async function(pet, resp){
    var nick = pet.body.nick
    var email = pet.body.email
    var nombre = pet.body.nombre
    var password = pet.body.password
    var apellidos = pet.body.apellidos
    var direccion = pet.body.direccion
    var telefono = pet.body.telefono

    if(nick&&email&&nombre&&password&&
        apellidos&&direccion&&telefono){
        

        try {
            
            const user = await userService.createUser(nick, email, nombre, password, apellidos, direccion, telefono)
            
            var mailOptions = {
                from: 'vestimentas.suaves@gmail.com',
                to: email,
                subject: 'Usuario creado con éxito',
                text: 'Hola ' + nombre + ', tu usuario ha sido creado correctamente. Accede con tu nick (' + nick + ') y tu contraseña. Un saludo y muchas gracias.'
            }
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                console.log(error);
                } else {
                console.log('Email sent: ' + info.response);
                }
            })
            resp.status(200)
            resp.send(user)
            console.log(user)
            
            } catch (err) {
            resp.status(500).send(err);
            } 
    }
    
    
})

function isString(x) {
    return Object.prototype.toString.call(x) === "[object String]"
  }

  router.get('/users/:id',chequeaJWT, async function(pet, resp){
    var id = pet.params.id
    if (!isString(id)) {
        resp.status(400)
        resp.send({mensaje:"El dato debe ser el nick"})
    }
    else{
        try{
            const dato = await userService.readUser(id)
            console.log(dato)
            if (dato){
                resp.status(200)
                resp.send(dato)
                console.log("Usuario " + dato.id)
            }
            else{
                resp.status(404)
                resp.send({mensaje: "Error: no esta en la lista"})
            }
        }catch(err){
            resp.status(500).send(err)
        }
        
       
    }
})

router.put('/users/:id',chequeaJWT, async function(pet, resp){
    try {
        var id = pet.params.id
        const user = await userService.updateUser(id, pet.body)
        resp.status(200)
        resp.send(user)
      } catch (err) {
        resp.status(500).send(err)
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
