const {Router} = require('express');
const {check} = require('express-validator');
const { crearCategoria, obtenerCategorias, actualizarCategoria, borrarCategoria, obtenerCategoriasPorId, suscribirCategoria, aprobarUsuario} = require('../controllers/categorias');
const { existeCategoriaPorId, usuarioSuscritoEnCategoria, esTagValido } = require('../helpers/db-validators');
const { validarJWT, esAdminRole } = require('../middlewares');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();


/**
 * {{url}}/api/categorias
 */

// Obtener todas las categorias - publico
router.get('/',obtenerCategorias)

// Obtener categoria por id - publico
router.get('/:id', [
        check('id', 'No es un id valido de mongo').isMongoId(),
        check('id').custom(existeCategoriaPorId),
        validarCampos
],obtenerCategoriasPorId)

// Crear categoria - privado - validar con token
router.post('/',[
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('descripcion', 'El descripcion es obligatorio').not().isEmpty(),
        check('tag', 'no es un tag valido').optional().custom(esTagValido),
        validarCampos
],crearCategoria)

// Actualizar - privado - validar con token
router.put('/:id',[
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('id').custom(existeCategoriaPorId),
        validarCampos
], actualizarCategoria)

// Suscribir - privado - validar con token
router.put('/suscribir/:id',[
        validarJWT,
        // check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('id').custom(existeCategoriaPorId),
        check('id', 'el id ya está suscrito a la categoria').custom(usuarioSuscritoEnCategoria),
        validarCampos
], suscribirCategoria)

router.put('/aprobar/:id',[
        validarJWT,
        // check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('id').custom(existeCategoriaPorId),
        validarCampos
], aprobarUsuario)

// Borrar una categoria - Admin
router.delete('/:id',[
        validarJWT,
        esAdminRole,
        check('id', 'No es un id valido de mongo').isMongoId(),
        validarCampos
], borrarCategoria)






module.exports = router;