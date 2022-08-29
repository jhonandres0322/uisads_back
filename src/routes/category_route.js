// * Llamado de las dependencias
const  { Router } = require('express');
const { check } = require('express-validator');
// * Llamado de los controladores
const { createCategory, getCategories, getCategoryById } = require('../controllers/category_controller');

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
    check('name').not().isEmpty(),
    createCategory
)

module.exports = router;