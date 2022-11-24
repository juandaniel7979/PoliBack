const { response,request } = require("express");
const {ObjectId} = require('mongoose').Types;
const jwt_decode = require("jwt-decode");


const { Subcategoria } = require('../models')


// Obtener subcategoria  - paginado - total - populate
const obtenerSubcategorias = async( req = request ,res=response ) => {
        const estado = { estado: true };
        const { limite = 5, desde = 0} = req.query  
        const {id} = req.params;
        const [total,Subcategorias] = await Promise.all([
            Subcategoria.countDocuments(estado),
            
            Subcategoria.find({id_categoria: ObjectId(id)})
                .skip(Number(desde))
                .limit(Number(limite))
        ]);
        
        res.json({
            total,
            Subcategorias
        })  
    
}
// Obtener subcategoria por id
const obtenerSubcategoriasPorId = async( req = request,res = response ) => {
            const {id} = req.params;
            const subcategoria = await Subcategoria.findById(id).populate('usuario','nombre ')



        res.json(subcategoria)  
    
}


const crearSubcategoria = async( req = request,res = response ) => {
    const nombre = req.body.nombre.toUpperCase();
    const data = req.body;
    const { id }= req.params;
    console.log({nombre})
    const subcategoriaDB = await Subcategoria.findOne({ nombre });

    if( subcategoriaDB ) {
        return res.status(400).json({
            msg: `La subcategoria ${ subcategoriaDB.nombre }, ya existe`
        });
    }

    data.id_categoria = id;
    data.nombre = nombre;
    data.id_profesor = req.usuario.id;
    const subcategoria = new Subcategoria( data );
    try {
        await subcategoria.save();
        res.status(201).json(subcategoria);
    } catch (error) {
        console.log('Fallo en el save del controlador ')        
        console.log(error)
    }
}

const actualizarSubcategoria = async( req = request ,res=response ) => {
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
        // const subcategoria = await Subcategoria.updateOne( {_id: ObjectId(id)}, data,{ $push: {suscriptores: ObjectId(req.usuario._id) } });
        const subcategoria = await Subcategoria.findByIdAndUpdate(id, data, {new:true});
        console.log(subcategoria)
        res.json(subcategoria)
}


const suscribirSubcategoria = async( req = request ,res=response ) => {
        
        const token = req.header('x-token');
        var decoded = jwt_decode(token);
        const uid = ObjectId(decoded.uid);
        const { id }= req.params;

        const subcategoria = await Subcategoria.updateOne({_id: ObjectId(id)}, { $push: {
            suscriptores: {
                _id:ObjectId(uid),
                estado:'PENDIENTE'
        }}} );
        res.json(subcategoria)
}


const borrarSubcategoria = async( req = request ,res=response ) => { 

        const {id} = req.params;
        const subcategoria = await Subcategoria.findByIdAndUpdate(id,{estado:false}, {new:true});
    
        res.json({Subcategoria})
}


module.exports = {
    obtenerSubcategorias,
    obtenerSubcategoriasPorId,
    crearSubcategoria,
    actualizarSubcategoria,
    borrarSubcategoria,
    suscribirSubcategoria,
}