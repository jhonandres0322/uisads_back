const { Router } = require('express');
const { check } = require('express-validator');

const {
    createReport
} = require('../controllers/report');

const { validateJWT } = require('../middlewares/validate_jwt');
const { validateFields } = require("../middlewares/validate_fields");
const { isProfileExists } = require("../middlewares/validate_user");

const router = Router();

router.post('/', 
    validateJWT,
    isProfileExists,
    check('profile','El usuario debe ser obligatorio').not().isEmpty(),
    check('profile').isMongoId(),
    check('ad','La publicación debe ser obligatoria').not().isEmpty(),
    check('ad').isMongoId(),
    check('description','Debe añadir una descripción').not().isEmpty(),
    validateFields,
    createReport
);
