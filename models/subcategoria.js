const {Schema, model} = require('mongoose');

const SubcategoriaSchema = Schema({
    id_categoria: {
        type: String,
        required: true,
        min: 6,
        max: 11
    },
    id_profesor: {
        type: String,
        required: true,
        min: 6,
        max: 11
    },
    nombre: {
        type: String,
        required: [true, 'El nombre es  obligatorio']
    },
    descripcion: {
        type: String,
        required: false,
        min: 6,
        max: 255
    },
    imagen: {
        type: String,
        required:false,
        min: 6,
        max: 400,
        default:""
    },
    estado:{
        type: String,
        default:'PUBLICO',
        required: false,
        enum: ['PUBLICO', 'PRIVADO', 'ELIMINADO']
    },
})


SubcategoriaSchema.methods.toJSON = function(){
    const {__v,...data} = this.toObject(); 
    return data; 
}

module.exports = model('Subcategoria', SubcategoriaSchema)