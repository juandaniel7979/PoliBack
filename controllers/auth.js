const { response, request } = require("express");
const bcryptjs = require('bcryptjs') 
const Usuario = require("../models/usuario"); 
const { generarJWT } = require("../helpers/generar-jwt");

const login = async(req,res = response) => {
    
    const {correo, contrasena} = req.body;
    
    try {
        //Verificar si el email existe
        const usuario = await Usuario.findOne({ correo })
        if(!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Contraseña no son correctos - correo'
            })
        }
        
        //Si el usuario está activo
        if(!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Contraseña no son correctos - estado:false'
            })
        }


        // Verificar la contraseña
        const validContrasena = bcryptjs.compareSync( contrasena, usuario.contrasena);
        if(!validContrasena){
            return res.status(400).json({
                msg: 'Usuario / Contraseña no son correctos - contraseña'
            })
        }

        //Generar JWT 
        const token = await generarJWT(usuario.id)
        
        return res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error);
        return res.json({
            msg: "Comuniquese con el administrador"
        })
    }
}



module.exports = {
    login,
}