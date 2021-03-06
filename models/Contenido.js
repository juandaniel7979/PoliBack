const mongoose = require('mongoose');
const contenidoSchema = mongoose.Schema({
    id_profesor: {
        type: String,
        required: true,
        min: 6,
        max: 11
    },
    id_subcategoria: {
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
    descripcion_corta: {
        type: String,
        required: true,
        min: 15,
        max: 255
    },
    descripcion: {
        type: String,
        required: true,
        min: 1,
        max: 255,
        default:" "
    },
    estado: {
        type: Number,
        required: true,
        min: 0,
        max: 1,
        default: 0
    }
})

module.exports = mongoose.model('Contenido', contenidoSchema)