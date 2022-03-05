const  { Router } = require('express');
const { check } = require('express-validator');
const { createCategory } = require('../controllers/category');


const router = Router();

router.post('/',
    check('name').not().isEmpty(),
    createCategory
)


module.exports = router;