const mongoose = require('mongoose');
const subcategoriaSchema = mongoose.Schema({
    id_categoria: {
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
    descripcion: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    estado: {
        type: Number,
        required: true,
        min: 0,
        max: 1,
        default: 0
    }
})

module.exports = mongoose.model('Subcategoria', subcategoriaSchema)