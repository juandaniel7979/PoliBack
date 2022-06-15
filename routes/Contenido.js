const router = require('express').Router();
const Subcategoria = require('../models/Subcategoria');
const Contenido = require('../models/Contenido');
const Url = require('../models/Url');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const jwt_decode = require("jwt-decode");
const Profesor = require('../models/Profesor');

function mensaje(campo){
    return{
        'string.empty': `el campo ${campo} es requerido`,
        'string.min': `el tamaño minimo para ${campo} es {#limit}`,
        'any.required': `el campo ${campo} es requerido`
    }
}

const checkid = Joi.object({
    id: Joi.string().min(1).required().messages(mensaje("id"))
})


const schemaRegistrarContenido = Joi.object({
    id_subcategoria: Joi.string().min(1).required().messages(mensaje("id_profesor")),
    nombre: Joi.string().min(2).max(255).required().messages(mensaje("nombre")),
    descripcion: Joi.string().min(20).max(255).required().messages(mensaje("descripcion")),
    // estado: Joi.string().min(0).max(1).required().messages(mensaje("contrasena"))
    
})

// crea una nueva categoria
router.post('/contenido', async (req, res) => {
    const { error } = schemaRegistrarContenido.validate(req.body);
    if (error) return res.status(400).json({ error: 1, message: error.details[0].message });
    const token = req.header('auth-token');
    var decoded = jwt_decode(token);
    const subcategoria = await Subcategoria.findOne({ _id: req.body.id_subcategoria });
        const contenido = new Contenido({
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            id_subcategoria: subcategoria._id
        });
        try {
            const contenidoSave = await contenido.save();
            res.json({
                error: 0,
                contenido: contenidoSave
            })
            
        } catch (error) {
            res.status(400).json({ error })
        }
})

router.get('/contenido', async (req, res) => {
    const { error } = checkid.validate(req.body);
    let contenido;
    if (error) {
        contenido = await Contenido.find();
    } else {
        try {
            contenido = await Contenido.find({ _id: req.body.id });
        } catch (error) {
            res.status(400).json({ error: 1, message: "el id de la contenido no existe o es incorrecto" });

        }
    }
    res.json({
        error: 0,
        contenido: contenido
    })
})


module.exports = router;