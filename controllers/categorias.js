const { response,request } = require("express");
const {ObjectId} = require('mongoose').Types;
const jwt_decode = require("jwt-decode");


const { Categoria } = require('../models')


// Obtener categoria  - paginado - total - populate
const obtenerCategorias = async( req = request ,res=response ) => {
        const estado = { estado: 'PUBLICO' };
        const { limite = 10, desde = 0} = req.query  
        
        const [total,categorias] = await Promise.all([
            Categoria.countDocuments(estado),
            Categoria.find()
                // .populate('usuario','nombre')
                .skip(Number(desde))
                .limit(Number(limite))
        ]);
        
        res.json({
            total,
            categorias
        })  
    
}
// Obtener categoria por id
const obtenerCategoriasPorId = async( req = request,res = response ) => {
            const {id} = req.params;
            console.log(id);
            const categoria = await Categoria.findById(id).populate('suscriptores');
            console.log(categoria)
            return res.json(categoria)  
    
}


// Obtener categoria por id
const obtenerCategoriasPorTag = async( req = request,res = response ) => {
            let {tag} = req.params;
            tag = tag.toUpperCase();
            console.log(tag);
            const categoria = await Categoria.find({tags: tag}).populate('suscriptores.suscriptor');
            // console.log(categoria)
            return res.json({categorias: categoria})  
    
}


const crearCategoria = async( req = request,res = response ) => {
    const nombre = req.body.nombre.toUpperCase();
    const { descripcion, tags, estado,} = req.body;

    const categoriaDB = await Categoria.findOne({ nombre });

    if( categoriaDB ) {
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre }, ya existe`
        });
    }
    let data;
    if( !tags ) {
        data = {
            nombre,
            descripcion,
            tags: ['GENERAL'],
            estado,
            id_profesor:req.usuario._id
        }
    }else{
        data = {
            nombre,
            descripcion,
            tags,
            estado,
            id_profesor:req.usuario._id
        }
    }
    // TODO
    console.log(data);
    const categoria = new Categoria( data );
    try {
        await categoria.save();
        res.status(201).json(categoria);
    } catch (error) {
        console.log('Fallo en el save del controlador ')        
        console.log(error)
    }
}

const actualizarCategoria = async( req = request ,res=response ) => {
        const token = req.header('x-token');
        var decoded = jwt_decode(token);
        const uid = ObjectId(decoded.uid);
        const { id }= req.params;
        const {usuario, tag, ...data} = req.body;

        // TODO: REVISAR GUARDAR TAGS
        // const {uid:algo} = usuario;
        data.nombre = data.nombre.toUpperCase();
        data.tag = req.tag
        // console.log(usuario)
        // data.suscriptores = uid
        console.log(data);
        // const categoria = await Categoria.updateOne( {_id: ObjectId(id)}, data,{ $push: {suscriptores: ObjectId(req.usuario._id) } });
        const categoria = await Categoria.findByIdAndUpdate(id, data, {new:true});
        console.log(categoria)
        res.json(categoria)
}


const suscribirCategoria = async( req = request ,res=response ) => {
        
        const token = req.header('x-token');
        var decoded = jwt_decode(token);
        const uid = ObjectId(decoded.uid);
        const { id }= req.params;

        const usuario = await Categoria.updateOne({_id: ObjectId(uid)}, {siguiendo});
        
        const categoria = await Categoria.updateOne({_id: ObjectId(id)}, { $push: {
            suscriptores: {
                suscriptor:ObjectId(uid),
                estado:'PENDIENTE'
        }
        }} );
        res.json(categoria)
}

const aprobarUsuario = async( req = request ,res=response ) => {
        
        const token = req.header('x-token');
        var decoded = jwt_decode(token);
        const uid = ObjectId(decoded.uid);
        const { id }= req.params;
        const temp = await Categoria.findById(id);

        userId = temp.suscriptores.find(element => {element.estado == "APROBADO"});
        console.log(first)
        
        const categoria = await Categoria.updateOne({_id: ObjectId(id)}, { $push: {
            suscriptores: {
                _id:ObjectId(uid),
                estado:'PENDIENTE'
        }}} );
        res.json(categoria)
}

const borrarCategoria = async( req = request ,res=response ) => { 

        const {id} = req.params;
        const categoria = await Categoria.findByIdAndUpdate(id,{estado:false}, {new:true});
    
        res.json({categoria})
}


module.exports = {
    obtenerCategorias,
    obtenerCategoriasPorId,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria,
    suscribirCategoria,
    aprobarUsuario,
    obtenerCategoriasPorTag
}