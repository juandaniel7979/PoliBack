const {Router} = require('express');
const {check} = require('express-validator');

const {validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
    } = require('../middlewares')

const { esRoleValido, emailExiste, exiseUsuarioPorId } = require('../helpers/db-validators');

const { usuariosGet,
        usuariosPost,
        usuariosDelete,
        usuariosPut,
        usuariosPatch, 
        usuariosGetPorRol} = require('../controllers/usuarios');

const router = Router();

router.get('/',usuariosGet)

router.get('/:id',[

], usuariosGet)


router.get('/admin/:rol',[
    // TODO: verificar admin
    check('id', 'No es un id de mongo').isMongoId(),
    check('estado', 'El estado es obligatorio').not().isEmail(),
    check('rol').custom(esRoleValido),
], usuariosGetPorRol)
router.get('/admin/:id',[
    // TODO: verificar admin
    check('id', 'No es un id de mongo').isMongoId(),
    check('id').custom(exiseUsuarioPorId),
], usuariosGetPorRol)

router.put('/:id',[
    check('id', 'No es un id de mongo').isMongoId(),
    check('id').custom(exiseUsuarioPorId),
    
    validarCampos
],usuariosPut) 

router.post('/',[
    check('nit', 'El nombre es obligatorio').not().isEmail(),
    check('nombre', 'El nombre es obligatorio').not().isEmail(),
    check('apellido', 'El apellido es obligatorio').not().isEmail(),
    check('contrasena', 'la contraseña es obligatoria y superior a 6 letras').isLength({min:6}),
    // check('correo', 'El correo no es valido').isEmail(),
    check('correo', 'El correo ya existe').custom(emailExiste),
    check('rol').custom( esRoleValido ),
    // check('rol', 'No es un rol valido').isIn(['ADMIN_ROL', 'USER_ROLE']),
    validarCampos

],usuariosPost);

router.delete('/:id',[
    validarJWT,
    // esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE', 'USER_ROLE'),
    check('id', 'No es un id de mongo').isMongoId(),
    check('id').custom(exiseUsuarioPorId),
    validarCampos
],usuariosDelete);
router.patch('/',usuariosPatch) 

module.exports = router;