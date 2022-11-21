const {Schema, model} = require('mongoose');

const ArchivoSchema = Schema({
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
        required: false,
        enum: ['Matematicas', 'Ciencias Naturales','Humanidades', 'Ingenierías', 'Educación en deportes']
    }],
    url: {
        type: String,
        required:false,
        min: 6,
        max: 400,
        default:""
    },
    suscriptores:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: false 
    },
    estado:{
        type: String,
        default: 'PUBLICO',
        required: true,
        enum: ['PUBLICO', 'PRIVADO', 'ELIMINADO']
    },
})


ArchivoSchema.methods.toJSON = function(){
    const {__v,estado,...data} = this.toObject(); 
    return data; 
}

module.exports = model('Archivo', ArchivoSchema)