// Invocación de las dependencias
const { Router } = require("express");
const { check } = require('express-validator');

// Invocacion de los controladores
const {
    login,
    registerUser
} = require('../controllers/auth');

// Invocacion de los middlewares
const { validateFields } = require("../middlewares/validate_fields");
const { isEmailExists } = require("../middlewares/validate_user");

const router = Router();

router.post('/login', 
    check('email', 'El correo es obligatorio').isEmail(),
    check('password','La contraseña es obligatoria').not().isEmpty(),
    validateFields,
    login 
);
router.post('/register',
    check('email','El correo es obligatorio').isEmail(), 
    check('password','La contraseña es obligatoria').not().isEmpty(),
    check('email').custom(isEmailExists),
    validateFields,
    registerUser
);

module.exports = router;