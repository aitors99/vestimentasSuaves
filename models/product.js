const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nombre: String,
    precio: Number,
    talla: String,
    color: String,
    marca: String,
    //filePath: String
})

const Product = mongoose.model('Product', productSchema)
module.exports = Product