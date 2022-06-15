const router = require('express').Router();
const Categoria = require('../models/Categoria');
const Subcategoria = require('../models/Subcategoria');
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


const schemaRegistrarSubcategoria = Joi.object({
    id_categoria: Joi.string().min(1).required().messages(mensaje("id_categoria")),
    nombre: Joi.string().min(2).max(255).required().messages(mensaje("nombre")),
    descripcion: Joi.string().min(20).max(255).required().messages(mensaje("descripcion")),
    // estado: Joi.string().min(0).max(1).required().messages(mensaje("contrasena"))
    
})

// crea una nueva categoria
router.post('/subcategoria', async (req, res) => {
    const { error } = schemaRegistrarSubcategoria.validate(req.body);
    if (error) return res.status(400).json({ error: 1, message: error.details[0].message });
    const token = req.header('auth-token');
    var decoded = jwt_decode(token);
    const categoria = await Categoria.findOne({ _id: req.body.id_categoria });
        const subcategoria = new Subcategoria({
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            id_categoria: categoria._id
        });
        try {
            const subcategoriaSave = await subcategoria.save();
            res.json({
                error: 0,
                subcategoria: subcategoriaSave
            })
            
        } catch (error) {
            res.status(400).json({ error })
        }
})

// trae todos los subcategorias
router.get('/subcategoria', async (req, res) => {
    const { error } = checkid.validate(req.body);
    let subcategoria;
    if (error) {
        subcategoria = await Subcategoria.find();
    } else {
        try {
            subcategoria = await Subcategoria.find({ _id: req.body.id });
        } catch (error) {
            res.status(400).json({ error: 1, message: "el id de la subcategoria no existe o es incorrecto" });

        }
    }
    res.json({
        error: 0,
        subcategoria: subcategoria
    })
})

module.exports = router;