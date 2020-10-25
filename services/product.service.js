const express = require('express')
const productModel = require('../models/product')

const fs = require('fs')

const productService = {

    readProducts: async function(limit, startIndex){
        try{
            const products = await productModel.find().limit(limit).skip(startIndex)
            return products
        }catch(err){
            throw new Error("Error: No se ha podido listar los productos")
        }
    },

    readProduct: async function(id){
        try{
            const product = await productModel.findById(id)
            return product
        }catch(err){
            throw new Error("Error: No se ha podido listar el producto")
        }
    },

    createProduct: async function(nombre, precio, talla, color, marca, filePath){
        try{
            const product = new productModel()

            product.nombre = nombre
            product.precio = precio
            product.talla = talla
            product.color = color
            product.marca = marca
            product.filePath = filePath
            product._id = null
            
            await product.save()
            return product
        }catch(err){
            throw new Error("Error: No se ha podido crear el producto")
        }
    },

    deleteProduct: async function(id){
        try{
            const product = await productModel.findByIdAndDelete(id)
            fs.unlinkSync('./assets/'+product.filePath)
            return product
        }catch(err){
            throw new Error("Error: No se ha podido borrar el producto")
        }
    },

    modifyProduct: async function(id, body){
        try{
            const product = await productModel.findByIdAndUpdate(id, body, {new:true})
            return product
        }catch(err){
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