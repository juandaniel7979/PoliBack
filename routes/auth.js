const router = require('express').Router();
// const User = require('../models/User');
const Profesor = require('../models/Profesor');
const Estudiante = require('../models/Estudiante');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const jwt_decode = require("jwt-decode");

const schemaRegisterProfesor = Joi.object({
    uid: Joi.string().min(6).max(255).required().messages(mensaje("uid")),
    nombre: Joi.string().min(2).max(255).required().messages(mensaje("nombre")),
    nombre_2: Joi.string().min(6).max(255).optional(),
    apellido: Joi.string().min(6).max(255).required().messages(mensaje("apellido")),
    apellido_2: Joi.string().min(6).max(255).optional(),
    correo: Joi.string().min(6).max(255).email().required().email().messages(mensaje("correo")),
    contrasena: Joi.string().min(6).max(1024).required().messages(mensaje("contrasena"))
    
})

const schemaRegisterEstudiante = Joi.object({
    uid: Joi.string().min(6).max(255).required().messages(mensaje("uid")),
    nombre: Joi.string().min(2).max(255).required().messages(mensaje("nombre")),
    nombre_2: Joi.string().min(6).max(255).optional(),
    apellido: Joi.string().min(6).max(255).required().messages(mensaje("apellido")),
    apellido_2: Joi.string().min(6).max(255).optional(),
    correo: Joi.string().min(6).max(255).email().required().email().messages(mensaje("correo")),
    contrasena: Joi.string().min(6).max(1024).required().messages(mensaje("contrasena"))
    
})

function mensaje(campo){
    return{
        'string.empty': `el campo ${campo} es requerido`,
        'string.min': `el tamaño minimo para ${campo} es {#limit}`,
        'any.required': `el campo ${campo} es requerido`
    }
}

const schemaLoginProfesor = Joi.object({
    correo: Joi.string().min(6).max(255).required().email().messages(mensaje("correo")),
    contrasena: Joi.string().min(6).max(1024).required().messages(mensaje("contrasena"))
})

const schemaLoginEstudiante = Joi.object({
    correo: Joi.string().min(6).max(255).required().email().messages(mensaje("correo")),
    contrasena: Joi.string().min(6).max(1024).required().messages('El usuario o contraseña son incorrectos')
})


router.post('/login-estudiante', async (req, res) => {
    // validaciones
    const { error } = schemaLoginEstudiante.validate(req.body);
    if (error) return res.status(400).json({ error: 1, message: error.details[0].message })

    const user = await Estudiante.findOne({ correo: req.body.correo });
    if (!user) return res.status(400).json({ error: 1, message: 'Usuario no encontrado' });

    const validateContrasena = await bcrypt.compare(req.body.contrasena, user.contrasena)
    if (!validateContrasena) return res.status(400).json({ error: true, mensaje: 'Contraseña incorrecta' })

    const token = jwt.sign({
        nombre: user.nombre,
        id: user._id
    }, process.env.TOKEN_SECRET)

    res.header('auth-token', token).json({
        error: 0,
        data: { user, token }
    })
})

router.post('/login-profesor', async (req, res) => {
    // validaciones
    const { error } = schemaLoginProfesor.validate(req.body);
    if (error) return res.status(400).json({ error: 1, message: error.details[0].message })

    const user = await Profesor.findOne({ correo: req.body.correo });
    if (!user) return res.status(400).json({ error: 1, message: 'Usuario no encontrado' });

    const validateContrasena = await bcrypt.compare(req.body.contrasena, user.contrasena)
    if (!validateContrasena) return res.status(400).json({ error: true, mensaje: 'Contraseña incorrecta' })

    const token = jwt.sign({
        nombre: user.nombre,
        id: user._id
    }, process.env.TOKEN_SECRET)

    res.header('auth-token', token).json({
        error: 0,
        data: { user, token }
    })
})




router.post('/register-profesor', async (req, res) => {
    const {error} =schemaRegisterProfesor.validate(req.body)
    if (error) {
        return res.status(400).json({error: 1, message: error.details[0].message})
    }
    const exiteEmail = await Profesor.findOne({ correo: req.body.correo});
    if (exiteEmail){
        return res.status(400).json({error: 1, message: true,message: "correo ya registrado"})
    }
    const saltos = await bcrypt.genSalt(10);
    const contrasena = await bcrypt.hash(req.body.contrasena, saltos);
    const user = new Profesor({
        uid: req.body.uid,
        nombre: req.body.nombre,
        nombre_2: req.body.nombre_2,
        apellido: req.body.apellido,
        apellido_2: req.body.apellido_2,
        correo: req.body.correo,
        contrasena
    });
    const token = jwt.sign({
        name: user.name,
        id: user._id
    }, process.env.TOKEN_SECRET)
    try {
        const savedUser = await user.save();
        res.json({
            error: 0,
            user: savedUser,
            log: savedUser,
            token
        })
    } catch (error) {
        res.status(400).json({ error })
    }
})


router.post('/register-estudiante', async (req, res) => {
    const {error} =schemaRegisterEstudiante.validate(req.body)
    if (error) {
        return res.status(400).json({error: 1, message: error.details[0].message})
    }
    const exiteEmail = await Estudiante.findOne({ correo: req.body.correo});
    if (exiteEmail){
        return res.status(400).json({error: 1, message: true,message: "correo ya registrado"})
    }
    const saltos = await bcrypt.genSalt(10);
    const contrasena = await bcrypt.hash(req.body.contrasena, saltos);
    const user = new Estudiante({
        uid: req.body.uid,
        nombre: req.body.nombre,
        nombre_2: req.body.nombre_2,
        apellido: req.body.apellido,
        apellido_2: req.body.apellido_2,
        correo: req.body.correo,
        contrasena
    });
    const token = jwt.sign({
        name: user.name,
        id: user._id
    }, process.env.TOKEN_SECRET)
    try {
        const savedUser = await user.save();
        res.json({
            error: 0,
            user: savedUser,
            log: savedUser,
            token
        })
    } catch (error) {
        res.status(400).json({ error })
    }
})

module.exports = router;