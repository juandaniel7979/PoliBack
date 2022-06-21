const router = require('express').Router();
const Categoria = require('../models/Categoria');
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


const listarCategoria = Joi.object({
    id: Joi.string().min(1).required().messages(mensaje("id_curso")),
    limit: Joi.number().min(1).messages(mensaje("limit"))
})

const schemaRegistrarCategoria = Joi.object({
    id_profesor: Joi.string().min(1).messages(mensaje("id_profesor")),
    nombre: Joi.string().min(2).max(255).required().messages(mensaje("nombre")),
    descripcion: Joi.string().min(20).max(255).required().messages(mensaje("descripcion")),
    // estado: Joi.string().min(0).max(1).required().messages(mensaje("contrasena"))
    
})

// crea una nueva categoria
router.post('/categoria', async (req, res) => {
    const { error } = schemaRegistrarCategoria.validate(req.body);
    if (error) return res.status(400).json({ error: 1, message: error.details[0].message });
    const token = req.header('auth-token');
    var decoded = jwt_decode(token);
    const exiteCategoria = await Categoria.findOne({ nombre: req.body.nombre});
    if (exiteCategoria){
        return res.status(400).json({error: 1, message: true,message: "Esta categoria ya existe"});
    }
    const userdata = await Profesor.findOne({ _id: decoded.id });
    if (userdata) {
        const categoria = new Categoria({
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            id_profesor: userdata._id
        });
        try {
            const categoriaSave = await categoria.save();
            res.json({
                error: 0,
                categoria: categoriaSave
            })
            
        } catch (error) {
            res.status(400).json({ error })
        }
    } else {
        res.status(400).json({ error: 1, message: `No tienes permisos para crear categorias` });
    }
})

//trae todos los categorias creadas por un profesor
router.get('/curso', async (req, res) => {
    const { error } = listarCategoria.validate(req.body);
    if (error) return res.status(400).json({ error: 1, message: error.details[0].message });
        if(req.body.limit){
            const categoria = await Categoria.find({ id_creador: req.body.id }).limit(req.body.limit);
            res.json({
                error: 0,
                curso: categoria
            })
        }else{
            const categoria = await Categoria.find({ id_creador: req.body.id });
            res.json({
                error: 0,
                curso: categoria
            })
        }
})



const checkid = Joi.object({
    id: Joi.string().min(1).required().messages(mensaje("id"))
})

// trae todos los categoria
router.get('/categoria', async (req, res) => {
    const { error } = checkid.validate(req.body);
    let categoria;
    if (error) {
        categoria = await Categoria.find();
    } else {
        try {
            categoria = await Categoria.find({ _id: req.body.id });
        } catch (error) {
            res.status(400).json({ error: 1, message: "el id de la categoria no existe o es incorrecto" });

        }
    }
    res.json({
        error: 0,
        categoria: categoria
    })
})


module.exports = router;