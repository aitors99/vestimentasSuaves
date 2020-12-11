const express = require('express')
const userModel = require('../models/user')




const userService = {

    getPassword: async function (id){
    
        try{
            const user = await userModel.findById(id)
            return user
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
            
            const previous = await userModel.findById(nick)

            if(previous==null){
                await user.save()
                return user
            }else{
                return null
            } 
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
    },

    deleteUser: async function(id){
        try{
            const previous = await userModel.findById(id)
            if(previous==null) return null
            const user = await userModel.findByIdAndDelete(id)
            return user
        }catch(err){
            throw new Error("Error: No se ha podido borrar el usuario")
        }
    }

}

module.exports = userService


