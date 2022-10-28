// * Llamado de las dependencias
const  { Router } = require('express');
const { check } = require('express-validator');
// * Llamado de los controladores
const { createCategory, getCategories, getCategoryById } = require('../controllers/category_controller');

const { validateFields } = require('../middlewares/validate_fields');

const router = Router();

// * Ruta para listar todas las categorias
router.get('/',
    getCategories
)

router.get('/:id',
    getCategoryById
)

// * Ruta para crear las categorias
router.post('/',
    check('name','El nombre de la categoria es obligatorio').not().isEmpty(),
    validateFields,
    createCategory
)

module.exports = router;