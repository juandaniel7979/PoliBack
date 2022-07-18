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
    descripcion: Joi.string().min(20).max(1024).required().messages(mensaje("descripcion")),
    // descripcion_2: Joi.array().min(1).max(1024).required().messages(mensaje("descripcion_2")),
    // estado: Joi.string().min(0).max(1).required().messages(mensaje("contrasena"))
    
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
            descripcion: req.body.descripcion,
            id_subcategoria: subcategoria._id
        });
        try {
            const contenidoSave = await contenido.save();
            res.json({
                error: 0,
                message: 'El contenido se ha agregado con exito' 
            })
            
        } catch (error) {
            res.status(400).json({ error })
        }
})

//trae todos los contenidos creadas dentro de una categoria
router.get('/contenidos', async (req, res) => {
    const { error } = checkid.validate(req.query);
    if (error) return res.status(400).json({ error: 1, message: error.details[0].message });
            const contenido = await Contenido.find({ id_subcategoria: req.query.id });
            res.json({
                error: 0,
                contenido: contenido
            })
})


//trae todos los contenidos creadas dentro de una subcategoria
router.get('/contenido', async (req, res) => {
    const { error } = checkid.validate(req.query);
    if (error) return res.status(400).json({ error: 1, message: error.details[0].message });
            const contenido = await Contenido.find({ id: req.query.id });
            res.json({
                error: 0,
                contenido: contenido
            })
})


//trae todos los contenidos creadas dentro de una categoria
router.put('/actualizar', async (req, res) => {
    const { error } = checkid.validate(req.query);
    if (error) return res.status(400).json({ error: 1, message: error.details[0].message });
    const token = req.header('auth-token');
    var decoded = jwt_decode(token);
    console.log(req.query.id)
    const contenido=null;
    const id = req.query.id;
        try {
            contenido = await Contenido.findById(decoded._id);
            console.log(contenido)
        } catch (error) {
            res.status(400).json({ error: 1, message: "el id de la subcategoria no existe o es incorrecto" });
        }
        if(contenido){
            const updateContenido = new Contenido({
                nombre: req.body.nombre,
                descripcion: req.body.descripcion,
            });
            await Contenido.updateOne({ _id:req }, { $set: updateContenido}).catch;
            const contenidoUpdated = await Contenido.find({ id:id });
            res.json({
                error: 0,
                contenido_actualizado: contenidoUpdated
            })

        }else{
            return res.json({
                error: 0,
                mensaje: 'No se ha encontrado la categoria que busca'
            })
        }
      res.json({
        error: 0,
        mensaje: 'No se ha encontrado la categoria que busca'
    })
})

//trae todos los contenidos creadas dentro de una categoria
router.put('/actualizar2', async (req, res) => {
    const { error } = checkidAct.validate(req.body);
    if (error) return res.status(400).json({ error: 1, message: error.details[0].message });
    // const token = req.header('auth-token');
    // var decoded = jwt_decode(token);
    // console.log(req.query.id)
    let contenido;
    // const id = req.query.id;
        try {
            contenido = await  Contenido.findOne({id: req.body.id});
            console.log(contenido)
        } catch (error) {
            res.status(400).json({ error: 1, message: "el id de la subcategoria no existe o es incorrecto" });
        }
        if(contenido){
            const updateContenido = new Contenido({
                nombre: req.body.nombre,
                descripcion: req.body.descripcion,
            });
            try {
                const rsp = await Contenido.updateOne({ _id:req }, { $set: updateContenido});
                console.log('LLego aqui');
                const contenidoUpdated = await Contenido.find({ id:req.body.id });
                res.json({
                    error: 0,
                    contenido_actualizado: contenidoUpdated,
                    rsp
                })  
            } catch (error) {
                res.status(400).json({ error: 1, message: "No se pudo actualizar el contenido" });
            }

        }else{
            return res.json({
                error: 0,
                mensaje: 'No se ha encontrado la categoria que busca'
            })
        }
    //   res.json({
    //     error: 0,
    //     mensaje: 'No se ha encontrado la categoria que busca'
    // })
})





const checkidAct = Joi.object({
    id: Joi.string().min(1).required().messages(mensaje("id")),
    nombre: Joi.string().min(6).max(50).messages(mensaje("nombre")),
    descripcion: Joi.string().min(6).max(255).messages(mensaje("descripcion"))
})

// actualizar usuarios
router.put('/actualizacion', async (req, res) => {
    const { error } = checkidAct.validate(req.body);
    console.log(req.body);
    if (error) return res.status(400).json({ error: 1, message: error.details[0].message });
    const token = req.header('auth-token');
    var decoded = jwt_decode(token);
    let contentData;
    try{
            contentData = await Contenido.findOne({id: req.body.id});
        //  res.json({
        //     error: 0,
        //     contenido: contentData
        // })
    }catch(error){
        res.status(400).json({ error: 1, message: "el id del contenido no existe o es incorrecto" });
    }
    
    if (req.body.nombre) {
        contentData.nombre = req.body.nombre;
    }
    if (req.body.descripcion) {
        contentData.descripcion = req.body.descripcion;
    }
    let rsp;
    try {
        rsp = await contentData.save();
        res.json({
            error: 0,
            data: rsp
        })
    } catch (error) {
        res.status(400).json({ error: 1, message: "no se pudo guardar" });
    }

    // res.json({
    //     error: 0,
    //     data: rsp
    // })
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