const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    _id: String,
    email: String,
    nombre: String,
    password: String,
    apellidos: String,
    direccion: String,
    telefono: String
  });

  const User = mongoose.model('User', userSchema)
  module.exports = User