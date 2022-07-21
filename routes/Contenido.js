const router = require('express').Router();
const Subcategoria = require('../models/Subcategoria');
const Contenido = require('../models/Contenido');
const Url = require('../models/Url');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const jwt_decode = require("jwt-decode");
const Profesor = require('../models/Profesor');
const mongo = require('mongoose');

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
    descripcion_corta: Joi.string().min(20).max(255).required().messages(mensaje("descripcion_corta")),
})

// crea una nueva categoria
router.post('/contenido', async (req, res) => {
    const { error } = schemaRegistrarContenido.validate(req.body);
    if (error) return res.status(400).json({ error: 1, message: error.details[0].message });
    const token = req.header('auth-token');
    var decoded = jwt_decode(token);
    const exiteContenido = await Contenido.findOne({ nombre: req.body.nombre});
    if (exiteContenido){
        return res.status(400).json({error: 1, message: true,message: "Hay una publicacion con el mismo titulo, por favor pruebe nuevamente con otro titulo"});
    }
    const subcategoria = await Subcategoria.findOne({ _id: req.body.id_subcategoria });
        const contenido = new Contenido({
            id_profesor:decoded.id,
            nombre: req.body.nombre,
            descripcion_corta: req.body.descripcion_corta,
            id_subcategoria: subcategoria._id
        });
        try {
            const contenidoSave = await contenido.save();
            res.json({
                error: 0,
                message: 'El contenido se ha agregado con exito',
                data: contenidoSave
            })
            
        } catch (error) {
            res.status(400).json({ error })
        }
})

//trae todos los contenidos creadas dentro de una categoria
router.get('/contenidos', async (req, res) => {
    const { error } = checkid.validate(req.query);
    if (error) return res.status(400).json({ error: 1, message: error.details[0].message });
            const contenido = await Contenido.findOne({ id_subcategoria: req.query.id ,estado:0});
            res.json({
                error: 0,
                contenido: contenido
            })
})


//trae todos los contenidos creadas dentro de una subcategoria
router.get('/contenido', async (req, res) => {
    const { error } = checkid.validate(req.query);
    if (error) return res.status(400).json({ error: 1, message: error.details[0].message });
            const contenido = await Contenido.findOne({ _id: req.query.id });
            res.json({
                error: 0,
                contenido: contenido
            })
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



const checkEditar = Joi.object({
    id_contenido: Joi.string().min(10).required().messages(mensaje("id_categoria")),
    nombre: Joi.string().allow('', null).messages(mensaje("nombre")),
    descripcion_corta:Joi.string().allow('', null).messages(mensaje("descripcion")),
    descripcion:Joi.string().allow('', null).messages(mensaje("descripcion")),
})


// Editar publicaciones
router.put('/editar', async (req, res) => {
    const { error } = checkEditar.validate(req.body);
    if (error) return res.status(400).json({ error: 1, message: error.details[0].message });
    const token = req.header('auth-token');
    var decoded = jwt_decode(token);
    const filter = {_id: req.body.id_contenido,id_profesor:decoded.id}
    let update;
    if(req.body.nombre!=='' && req.body.descripcion!=='' && req.body.nombre.length>6 && req.body.descripcion.length>20){
        update = {nombre: req.body.nombre,descripcion_corta:req.body.descripcion_corta };
        console.log('entro al 1');
    }else if(req.body.nombre!=='' && req.body.descripcion_corta==='' && req.body.nombre.length>6){
        console.log('entro al 2');
        update = {nombre: req.body.nombre};
    }else if(req.body.nombre==='' && req.body.descripcion_corta!==''  && req.body.descripcion_corta.length>20){
        console.log('entro al 3');
        update = {descripcion_corta:req.body.descripcion_corta };
    }else{
        res.json({
            error: 1,
            mensaje: 'La descripcion corta debe tener mas de 20 caracteres y el nombre mas de 6'
        })
    }
    
    try {
        let rsp = await Contenido.findOneAndUpdate(filter, update);
        rsp = await Contenido.findOne(filter);
        res.json({
            error: 0,
            data: rsp
        })
    } catch (error) {
        res.status(400).json({ error: 1, message: "no se pudo actualizar" });
    }
});


const checkEditarPublicacion = Joi.object({
    id_contenido: Joi.string().min(10).required().messages(mensaje("id_contenido")),
    descripcion:Joi.string().allow('', null).messages(mensaje("descripcion")),
})


// Editar publicaciones
router.put('/editarPub', async (req, res) => {
    const { error } = checkEditarPublicacion.validate(req.body);
    if (error) return res.status(400).json({ error: 1, message: error.details[0].message });
    const token = req.header('auth-token');
    var decoded = jwt_decode(token);
    console.log(token);
    console.log(decoded.id);
    const filter = {_id: req.body.id_contenido,id_profesor:decoded.id}
    const update = {descripcion:req.body.descripcion };

    try {
        let rsp = await Contenido.findOneAndUpdate(filter, update);
        rsp = await Contenido.findOne(filter);
        console.log(rsp);
        res.json({
            error: 0,
            data: rsp
        })
    } catch (error) {
        res.status(400).json({ error: 1, message: "no se pudo actualizar" });
    }
});


module.exports = router;