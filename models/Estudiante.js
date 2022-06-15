const mongoose = require('mongoose');
const estudianteSchema = mongoose.Schema({
    uid: {
        type: String,
        required: true,
        min: 6,
        max: 11
    },
    nombre: {
        type: String,
        required: true,
        min: 6,
        max: 50
    },
    nombre_2: {
        type: String,
        required: false,
        min: 6,
        max: 50
    },
    apellido: {
        type: String,
        required: true,
        min: 6,
        max: 50
    },
    apellido_2: {
        type: String,
        required: false,
        min: 6,
        max: 50
    },
    correo: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    contrasena: {
        type: String,
        required: true,
        min: 6,
        max: 40
    }
})

module.exports = mongoose.model('Estudiante', estudianteSchema)