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
    const exiteSubcategoria = await Subcategoria.findOne({ nombre: req.body.nombre});
    if (exiteSubcategoria){
        return res.status(400).json({error: 1, message: true,message: "Esta subcategoria ya existe"});
    }
    const categoria = await Categoria.findOne({ _id: req.body.id_categoria });
        const subcategoria = new Subcategoria({
            id_profesor:decoded.id,
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

//trae todos los categorias creadas dentro de una categoria
router.get('/subcategorias', async (req, res) => {
    const { error } = checkid.validate(req.query);
    if (error) return res.status(400).json({ error: 1, message: error.details[0].message });
            const subcategoria = await Subcategoria.find({ id_categoria: req.query.id,estado:0 });
            res.json({
                error: 0,
                subcategoria: subcategoria
            })
})



// trae todos los subcategorias
router.get('/subcategoria', async (req, res) => {
    const { error } = checkid.validate(req.body);
    let subcategoria;
    if (error) {
        subcategoria = await Subcategoria.find({estado:0});
    } else {
        try {
            subcategoria = await Subcategoria.find({ _id: req.body.id,estado:0});
        } catch (error) {
            res.status(400).json({ error: 1, message: "el id de la subcategoria no existe o es incorrecto" });

        }
    }
    res.json({
        error: 0,
        subcategoria: subcategoria
    })
})

// trae todos los subcategorias
router.get('/all', async (req, res) => {
    const { error } = checkid.validate(req.body);
    let subcategoria;
    if (error) {
        subcategoria = await Subcategoria.find();
    } else {
        try {
            subcategoria = await Subcategoria.find({ _id: req.body.id,estado:0});
        } catch (error) {
            res.status(400).json({ error: 1, message: "el id de la subcategoria no existe o es incorrecto" });

        }
    }
    res.json({
        error: 0,
        subcategoria: subcategoria
    })
})



const checkUrl = Joi.object({
    id_subcategoria: Joi.string().min(10).required().messages(mensaje("id_subcategoria")),
    url: Joi.string().min(50).required().messages(mensaje("url")),
})

// router.put('/url', async (req, res) => {
//     const { error } = checkUrl.validate(req.body);
//     console.log(req.body);
//     if (error) return res.status(400).json({ error: 1, message: error.details[0].message });
//     const token = req.header('auth-token');
//     var decoded = jwt_decode(token);
//     let contentData;
//     try{
//             subcategoriaData = await Subcategoria.findOne({id: req.body.id});
//         //  res.json({
//         //     error: 0,
//         //     contenido: contentData
//         // })
//     }catch(error){
//         res.status(400).json({ error: 1, message: "el id de la subcategoria no existe o es incorrecto" });
//     }
    

//     if (req.body.url) {
//         subcategoriaData.url = req.body.url;
//     }
//     let rsp;
//     try {
//         rsp = await subcategoriaData.save();
//         res.json({
//             error: 0,
//             data: rsp
//         })
//     } catch (error) {
//         res.status(400).json({ error: 1, message: "no se pudo guardar" });
//     }

// });

router.put('/url', async (req, res) => {
    const { error } = checkUrl.validate(req.body);
    console.log(req.body);
    if (error) return res.status(400).json({ error: 1, message: error.details[0].message });
    const token = req.header('auth-token');
    var decoded = jwt_decode(token);

    const filter = {_id: req.body.id_subcategoria}
    const update = { url: req.body.url };
    const doc= Subcategoria.findOne(filter);
    if(doc){
        try {
            let rsp = await Subcategoria.findOneAndUpdate(filter, update);
            rsp = await Subcategoria.findOne(filter);
            res.json({
                error: 0,
                data: rsp
            })
        } catch (error) {
            res.status(400).json({ error: 1, message: "no se pudo actualizar la url" });
        }
    }
    // try {
    //     let rsp = await Subcategoria.findOneAndUpdate(filter, update);
    //     rsp = await Subcategoria.findOne(filter);
    //     res.json({
    //         error: 0,
    //         data: rsp
    //     })
    // } catch (error) {
    //     res.status(400).json({ error: 1, message: "no se pudo actualizar la url" });
    // }

});


const checkBorrar = Joi.object({
    id: Joi.string().min(10).required().messages(mensaje("id_subcategoria")),
})

router.put('/borrar', async (req, res) => {
    const { error } = checkBorrar.validate(req.body);
    console.log(req.body);
    if (error) return res.status(400).json({ error: 1, message: error.details[0].message });
    const token = req.header('auth-token');
    var decoded = jwt_decode(token);
    const filter = {_id: req.body.id}
    const update = { estado: 1 };
    
    try {
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


module.exports = router;