const {Schema, model} = require('mongoose');

const TagSchema = Schema({
    rol:{
        type: String,
        required: false
    }
})

module.exports = model('Tag', TagSchema)