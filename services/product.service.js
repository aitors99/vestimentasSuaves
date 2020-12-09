const express = require('express')
const productModel = require('../models/product')

//const fs = require('fs')
const { isValidObjectId } = require('mongoose')

const productService = {

    readProducts: async function(limit, startIndex){
        try{
            const products = await productModel.find().limit(limit).skip(startIndex)
            return products
        }catch(err){
            throw new Error("Error: No se ha podido listar los productos")
        }
    },

    createProduct: async function(nombre, precio, talla, color, marca){
        try{
            const product = new productModel()

            product.nombre = nombre
            product.precio = precio
            product.talla = talla
            product.color = color
            product.marca = marca
            product._id = null
            await product.save(function(err,room) {
                console.log(room);
             });

            return product
        }catch(err){
            throw new Error("Error: No se ha podido crear el producto")
        }
    },

    deleteProduct: async function(id){
        try{
            const previous = await productModel.findById(id)
            if(previous==null) return null
            const product = await productModel.findByIdAndDelete(id)
            //fs.unlinkSync('./assets/'+product.filePath)
            return product
        }catch(err){
            throw new Error("Error: No se ha podido borrar el producto")
        }
        
        
    },

    modifyProduct: async function(id, body, newName){
        try{
            
            const previous = await productModel.findById(id)
            if(previous==null) return null
            //fs.unlinkSync('./assets/'+previous.filePath)
            body.filePath = newName
            const product = await productModel.findByIdAndUpdate(id, body, {new:true})
            return product
            
        }catch(err){
            //fs.unlinkSync('./assets/'+newName)
            throw new Error("Error: No se ha podido modificar el producto")
        }
    },

    getLentgh: async function(){
        try{
            const n = await productModel.countDocuments()
            return n
        }catch(err){
            throw new Error("Error: No se ha podido obtener el número de productos")
        }
    }
}

module.exports = productService