const express = require('express')
const userModel = require('../models/user')



const userService = {

    getPassword: async function (id, pass){
    
        try{
            var password = await userModel.findById(id).password
            if(password === pass) return true
            else return false
            
        }catch(err){
            throw new Error("Error: No se ha podido recuperar la contraseña")
        }
    },

    createUser: async function (nick, email, nombre, password, apellidos, direccion, telefono){
        try{
            const user = new userModel()

            user._id = nick
            user.email = email
            user.nombre = nombre
            user.password = password
            user.apellidos = apellidos
            user.direccion = direccion
            user.telefono = telefono
    
            await user.save()

            return user
        }catch(err){
            throw new Error("Error: No se ha podido crear el usuario")
        } 
    },

    updateUser: async function(id, body){
        try{
            const user = await userModel.findByIdAndUpdate(id, body, {new:true})
            return user
        }catch(err){
            throw new Error("Error: No se ha podido actualizar el usuario")
        }
    },

    readUser: async function(id){
        try{
            const user = await userModel.findById(id)
            return user
        }catch(err){
            throw new Error("Error: No se ha podido leer el usuario")
        }
    }

}

module.exports = userService


