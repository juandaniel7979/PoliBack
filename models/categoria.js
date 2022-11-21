const {Schema, model} = require('mongoose');

const CategoriaSchema = Schema({
    id_profesor: {
        type: String,
        required: true,
        min: 6,
        max: 11
    },
    nombre: {
        type: String,
        required: [true, 'El nombre es  obligatorio'],
        unique: true
    },
    descripcion: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    tags: [{
        type: String,
        default:'GENERAL',
        required: false,
        enum: ["MATEMATICAS", "SOCIALES", "CIENCIAS NATURALES", "REDES", "GENERAL", "OTROS"]
    }],
    url: {
        type: String,
        required:false,
        min: 6,
        max: 400,
        default:""
    },
    imagen: {
        type: String,
        required:false,
        min: 6,
        max: 400,
        default:""
    },
    suscriptores:{
        type: Array,
        default: [],
    },
    estado:{
        type: String,
        required: true,
        enum: ['PUBLICO', 'PRIVADO', 'ELIMINADO']
    },
})


CategoriaSchema.methods.toJSON = function(){
    const {__v,...data} = this.toObject(); 
    return data; 
}

module.exports = model('Categoria', CategoriaSchema)