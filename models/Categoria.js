const mongoose = require('mongoose');
const categoriaSchema = mongoose.Schema({
    id_profesor: {
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
    url: {
        type: String,
        required:false,
        min: 6,
        max: 400,
        default:""
    },
    estado: {
        type: Number,
        required: true,
        min: 0,
        max: 1,
        default: 0
    },
    
})

module.exports = mongoose.model('Categoria', categoriaSchema)