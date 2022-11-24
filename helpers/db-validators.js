const { Categoria,Producto, Subcategoria } = require('../models');
const Role = require('../models/role')
const Tag = require('../models/tag')
const Usuario = require('../models/usuario')



const esRoleValido = async(rol='') => {
    const existeRol = await Role.findOne({ rol });
    if(!existeRol) throw new Error(`El rol ${ rol } no está registrado en la base de datos`)

}


const esTagValido = async(tag='') => {
    const existeTag = await Tag.findOne({ tag });
    if(!existeTag) throw new Error(`El tag ${ tag } no está registrado en la base de datos`)

}

// Usuario
const emailExiste = async(correo='algo') => {
    const existeEmail = await Usuario.findOne({ correo });
    if( existeEmail )throw new Error(`El correo ${correo } ya está registrado en la base de datos`)

}

const exiseUsuarioPorId = async(id) => {
    const existeUsuario = await Usuario.findById(id);
    if( !existeUsuario )throw new Error(`El id ${id } no existe`)

}

// Categoria
const existeCategoriaPorId = async(id) => {
    const existeCategoria = await Categoria.findById(id);
    if( !existeCategoria )throw new Error(`El id no existe: ${id}`)

}

const usuarioSuscritoEnCategoria = async(id) => {
    const categoria = await Categoria.findById(id);
    userId = categoria.suscriptores.find(element => element._id);
    if(userId)throw new Error(`El usuario ya se encuentra suscrito a la categoria`)
}


// Subcategoria


// Producto
const existeProductoPorId = async(id) => {
    const existeProducto = await Producto.findById(id);
    if( !existeProducto )throw new Error(`El id no existe: ${id}`)

}

const colleccionesPermitidas = ( coleccion = '', colecciones = []) => {
    const incluida = colecciones.includes( coleccion );
    if( !incluida ) {
        throw new Error( `La coleccion ${ coleccion } no es permitida, ${ colecciones }`)
    }
    return true; 
}

// const existeCategoriaPorId = async(id) => {
//     const existeCategoriaPorId = await Categoria.findOne({ nombre });
//     if( existeCategoriaPorId )throw new Error(`Esa categoria ya existe`)
// }

module.exports = {
    esRoleValido,
    emailExiste,
    exiseUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    colleccionesPermitidas,
    usuarioSuscritoEnCategoria,
    esTagValido
}