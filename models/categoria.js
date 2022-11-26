const {Schema, model} = require('mongoose');

const CategoriaSchema = Schema(
    {
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
            enum: ["MATEMATICAS", "DEPORTES", "SOCIALES", "CIENCIAS NATURALES", "REDES", "GENERAL", "OTROS", "MEDICINA", "INGENIERIA"]
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
    suscriptores:[
        {
            suscriptor: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
            estado: {
                type: String,
                required:true,
                enum: ['PENDIENTE', 'APROBADO', 'RECHAZADO']
            }
        }
    ],
    estado:{
        type: String,
        required: true,
        enum: ['PUBLICO', 'PRIVADO', 'ELIMINADO']
    },
    },
    {
        toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
        toObject: { virtuals: true } 
    }
)

// CategoriaSchema.virtual('suscriptores',
//     {
//         ref: 'Usuario',
//         localField: '_id',
//         foreignField: 'nombre'
//     }
// )


CategoriaSchema.methods.toJSON = function(){
    const {__v,...data} = this.toObject(); 
    return data; 
}

module.exports = model('Categoria', CategoriaSchema)