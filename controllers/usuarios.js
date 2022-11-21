const {response, request} = require('express');
const bcryptjs = require('bcryptjs');
const Usuario  = require('../models/usuario');

const usuariosGet = async (req = request,res = response)=>{
    const estadoPendiente = { estado: "PENDIENTE" };
    const estadoAprobado = { estado: "APROBADO" };
    const estadoRechazado = { estado: "RECHAZADO" };
    const { limite = 5, desde = 0} = req.query
    
    const [Tpendientes,Taprobados, Trechazados, usuarios] = await Promise.all([
        Usuario.countDocuments(estadoPendiente),
        Usuario.countDocuments(estadoAprobado),
        Usuario.countDocuments(estadoRechazado),
        Usuario.find()
            .skip(Number(desde))
            .limit(Number(limite))
    ]);
    
    res.json({
        Tpendientes,
        Taprobados,
        Trechazados,
        usuarios
    })  
}


const usuariosPost = async (req,res = response)=>{
        console.log(req.body)
        const { nit, nombre,nombre_2, apellido, apellido_2, correo, contrasena, rol } = req.body;
        const usuario = new Usuario({nit,nombre, nombre_2, apellido,apellido_2, correo, contrasena, rol});

        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync(10);
        usuario.contrasena = bcryptjs.hashSync( contrasena, salt);

        // Guardar en DB
        await  usuario.save();

        res.json({
            usuario,
        })
}


const usuariosPut = async (req,res = response)=>{
    const { id }= req.params;
    const {contrasena,correo, ...resto} = req.body;
    //Validacion contra BD
    if(contrasena){
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync(10);
        resto.contrasena = bcryptjs.hashSync( contrasena, salt);

    } 
    const usuario = await Usuario.findByIdAndUpdate( id, resto);

    res.json({
        msg:'API Put - controlador',
        id
    })
}
const usuariosPatch = (req,res = response)=>{
    res.json({
        msg:'API Patch - controlador'
    })
}

const usuariosDelete = async(req,res = response)=>{

    const {id} = req.params;
    const usuario = await Usuario.findByIdAndUpdate(id,{estado:false});

    res.json({usuario})
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPatch,
    usuariosPut,
    usuariosDelete
}