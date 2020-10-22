const express = require('express')
const Product = require('../models/product')
const productModel = require('../models/product')

const productService = {

    readProducts: async function(){
        try{
            const products = await productModel.find({})
            return products
        }catch(err){
            throw new Error("Error: No se ha podido listar los productos")
        }
    },

    readProduct: async function(id){
        try{
            const products = await productModel.findById(id)
            return products
        }catch(err){
            throw new Error("Error: No se ha podido listar el producto")
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

            await product.save()
            return product
        }catch(err){
            throw new Error("Error: No se ha podido crear el producto")
        }
    },

    deleteProduct: async function(id){
        try{
            const product = await productModel.findByIdAndDelete(id)
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
    }
}

module.exports = productService