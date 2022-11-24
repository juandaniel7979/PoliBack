const {Router} = require('express');
const {check} = require('express-validator');
const { crearSubcategoria, obtenerSubcategorias, actualizarSubcategoria, borrarSubcategoria } = require('../controllers/subcategorias');
const {  esTagValido, existeCategoriaPorId } = require('../helpers/db-validators');
const { validarJWT, esAdminRole } = require('../middlewares');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();


/**
 * {{url}}/api/categorias
 */



// Obtener subcategorias por id - publico
router.get('/:id', [
        check('id', 'No es un id valido de mongo').isMongoId(),
        check('id').custom(existeCategoriaPorId),
        validarCampos
],obtenerSubcategorias)

// Crear categoria - privado - validar con token
router.post('/:id',[
        validarJWT,
        check('id', 'No es un id valido de mongo').isMongoId(),
        check('id').custom(existeCategoriaPorId),
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        // check('descripcion', 'El descripcion es obligatorio').not().isEmpty(),
        validarCampos
],crearSubcategoria)

// Actualizar - privado - validar con token
router.put('/:id',[
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('id').custom(existeCategoriaPorId),
        validarCampos
], actualizarSubcategoria)


// Borrar una categoria - Admin
router.delete('/:id',[
        validarJWT,
        esAdminRole,
        check('id', 'No es un id valido de mongo').isMongoId(),
        validarCampos
], borrarSubcategoria)






module.exports = router;