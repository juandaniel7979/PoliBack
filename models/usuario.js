const {Schema, model} = require('mongoose');

const UsuarioSchema = Schema({
    nit: {
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
    },
    imagen:{
        type: String,
        required: false
    },
    rol:{
        type: String,
        required: true,
        enum: ['ADMINISTRADOR', 'PROFESOR','ESTUDIANTE']
    },
    estado: {
        type: String,
        required: false,
        default: 'PENDIENTE',
        enum: ['PENDIENTE', 'APROBADO','RECHAZADO']
    },
    siguiendo:{
        type: Array,
        default: [],
    },
});


UsuarioSchema.methods.toJSON = function(){
    const {__v,_id, password,...usuario} = this.toObject(); 
    usuario.uid = _id;
    return usuario; 
}

module.exports = model( 'Usuario', UsuarioSchema );