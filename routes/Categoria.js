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
        return res.status(400).json({error: 1, message: true,message: "La categoria que intenta añadir ya existe"});
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
router.get('/categorias', async (req, res) => {
    const { error } = checkid.validate(req.query);
    if (error) return res.status(400).json({ error: 1, message: error.details[0].message });
            const categoria = await Categoria.find({ id_profesor: req.query.id,estado:0});
            res.json({
                error: 0,
                categoria: categoria
            })
})



const checkid = Joi.object({
    id: Joi.string().min(1).required().messages(mensaje("id"))
})

// trae todos los categoria
router.get('/categoria', async (req, res) => {
    const { error } = checkid.validate(req.body);
    let categoria;
    let profesor;
    let profesores = [];
    if (error) {
        categoria = await Categoria.find({estado:0});
        for (let index = 0; index < categoria.length; index++) {
            const element = categoria[index];
            profesor = await Profesor.findOne({_id:categoria[index].id_profesor})
            let temp = {profesor:profesor,element};
            profesores.push(temp);
        }
        // profesor = await Profesor.find({_id:categoria.id_profesor})
        // console.log('Profesores')
        // console.log(profesores);
    } else {
        try {
            categoria = await Categoria.find({ _id: req.body.id,estado:0 });
            profesor = await Profesor.find({_id:categoria.id_profesor})
        } catch (error) {
            res.status(400).json({ error: 1, message: "el id de la categoria no existe o es incorrecto" });

        }
    }
    res.json({
        error: 0,
        categoria: profesores
        // profesor: profesor
    })
})


const checkEditar = Joi.object({
    id_categoria: Joi.string().min(10).required().messages(mensaje("id_categoria")),
    nombre: Joi.string().allow('', null).messages(mensaje("nombre")),
    descripcion:Joi.string().allow('', null).messages(mensaje("descripcion")),
})

// Editar categorias
router.put('/editar', async (req, res) => {
    const { error } = checkEditar.validate(req.body);
    if (error) return res.status(400).json({ error: 1, message: error.details[0].message });
    const token = req.header('auth-token');
    var decoded = jwt_decode(token);
    const filter = {_id: req.body.id_categoria,id_profesor:decoded.id}

    let update;
    if(req.body.nombre!=='' && req.body.descripcion!=='' && req.body.nombre.length>6 && req.body.descripcion.length>20){
        update = {nombre: req.body.nombre,descripcion:req.body.descripcion };
        console.log('entro al 1');
    }else if(req.body.nombre!=='' && req.body.descripcion==='' && req.body.nombre.length>6){
        console.log('entro al 2');
        update = {nombre: req.body.nombre};
    }else if(req.body.nombre==='' && req.body.descripcion!==''  && req.body.descripcion.length>20){
        console.log('entro al 3');
        update = {descripcion:req.body.descripcion };
    }else{
        res.json({
            error: 1,
            mensaje: 'La descripcion debe tener mas de 20 caracteres y el nombre mas de 6'
        })
    }
    
    try {
        let alguna = await Subcategoria.findOne(filter);
        console.log(alguna);
        let rsp = await Subcategoria.findOneAndUpdate(filter, update);
        rsp = await Subcategoria.findOne(filter);
        res.json({
            error: 0,
            data: rsp
        })
    } catch (error) {
        res.status(400).json({ error: 1, message: "no se pudo actualizar" });
    }
});




const checkBorrar = Joi.object({
    id: Joi.string().min(10).required().messages(mensaje("id_categoria")),
})

//Ruta para realizar el borrado logico de una subcategoria
router.put('/borrar', async (req, res) => {
    const { error } = checkBorrar.validate(req.body);
    console.log(req.body);
    if (error) return res.status(400).json({ error: 1, message: error.details[0].message });
    const token = req.header('auth-token');
    var decoded = jwt_decode(token);
    const filter = {_id: req.body.id,id_profesor:decoded.id}
    const update = { estado: 1 };
    
    try {
        let rsp = await Categoria.findOneAndUpdate(filter, update);
        rsp = await Categoria.findOne(filter);
        res.json({
            error: 0,
            data: rsp
        })
    } catch (error) {
        res.status(400).json({ error: 1, message: "no se pudo actualizar" });
    }
});



module.exports = router;