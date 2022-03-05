const  { Router } = require('express');
const { check } = require('express-validator');
const { createCategory, getCategories } = require('../controllers/category');


const router = Router();

router.get('/',
    getCategories
)

router.post('/',
    check('name').not().isEmpty(),
    createCategory
)


module.exports = router;