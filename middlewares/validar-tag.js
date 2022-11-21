const tieneTag = ( ...tags ) => {

    return  (req = request, res = response, next) => {

        if( !req.tag ){}

        if( !roles.includes(req.tag) )return res.status(401).json({
            msg: `El servicio requiere uno de estos roles ${tags}`
        })
        next();
    }
}


module.exports = {
    tieneTag
}