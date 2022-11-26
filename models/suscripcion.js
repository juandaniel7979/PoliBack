const {Schema, model} = require('mongoose');

const RoleSchema = Schema({
    rol:{
        type: String,
        required: [true, 'El rol es  obligatorio']
    }
})


CategoriaSchema.virtual('suscriptores',
    {
        ref: 'Usuario',
        localField: '_id',
        foreignField: 'nombre'
    }
)

module.exports = model('Role', RoleSchema)