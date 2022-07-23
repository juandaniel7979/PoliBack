const mongoose = require('mongoose');
const profesorSchema = mongoose.Schema({
    uid: {
        type: String,
        required: true,
        min: 6,
        max: 11
    },
    nombre: {
        type: String,
        required: true,
        min: 2,
        max: 50
    },
    nombre_2: {
        type: String,
        required: false,
        min: 2,
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
    },
    estado: {
        type: Number,
        required: true,
        min: 0,
        max: 1,
        default: 0
    },
    administrador: {
        type: Number,
        required: true,
        min: 0,
        max: 1,
        default: 0
    }
})

module.exports = mongoose.model('Profesor', profesorSchema)