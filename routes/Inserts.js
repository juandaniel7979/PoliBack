const router = require('express').Router();
const Categoria = require('../models/Categoria');
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

const listarCategoria = Joi.object({
    id: Joi.string().min(1).required().messages(mensaje("id_curso")),
    limit: Joi.number().min(1).messages(mensaje("limit"))
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