const mongoose = require('mongoose');
const urlSchema = mongoose.Schema({
    id_subcategoria: {
        type: String,
        required: true,
        min: 6,
        max: 11
    },
    url: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
})

module.exports = mongoose.model('Url', urlSchema)