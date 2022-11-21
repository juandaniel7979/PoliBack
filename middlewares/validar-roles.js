const { response, request } = require("express")

const esAdminRole = (req = request, res = response, next) => {

    // console.log(req)
    if( !req.usuario )return res.status(401).json({msg: 'Se requiere verificar el token primero'})
    
    const { rol, nombre } = req.usuario;

    if( rol !== 'ADMINISTRADOR' )return res.status(401).json({msg: `${ nombre } no es administrador - no puede hacer esto`})
    
    next();
}


const tieneRole = ( ...roles ) => {

    return  (req = request, res = response, next) => {

        if( !req.usuario )return res.status(500).json({msg: 'Se requiere verificar el role sin validar el token primero'})
        console.log(roles);

        if( !roles.includes(req.usuario.rol) )return res.status(401).json({
            msg: `El servicio requiere uno de estos roles ${roles}`
        })
        next();
    }
}



module.exports = {
    esAdminRole,
    tieneRole,
}