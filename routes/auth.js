// * Llamado de las dependencias
const { Router } = require("express");
const { check } = require('express-validator');

// * Llamado de los controladores
const {
    login,
    registerUser,
    changePassword,
    forgotPassword,
    validateCodeOTP
} = require('../controllers/auth');

// * Llamado de los middlewares
const { validateFields } = require("../middlewares/validate_fields");
const { isEmailExists } = require("../middlewares/validate_user");
const { validateJWT } = require('../middlewares/validate_jwt');

const router = Router();

// * Ruta para loguearse en la aplicación
router.post('/login', 
    check('email', 'El correo es obligatorio').isEmail(),
    check('password','La contraseña es obligatoria').not().isEmpty(),
    validateFields,
    login 
);

// * Ruta para registrar un nuevo usuario
router.post('/register',
    check('email','El correo es obligatorio').isEmail(), 
    check('password','La contraseña es obligatoria').not().isEmpty(),
    check('email').custom(isEmailExists),
    validateFields,
    registerUser
);

// * Ruta para cambiar la contraseña
router.post('/change-password',
    validateJWT,
    changePassword
);

// * Ruta para pedir un nuevo cambio de contraseña
router.post('/forget-password',
    check('email','El correo es obligatorio').isEmail(),
    validateFields,
    forgotPassword
);

// * Ruta para verificar el otp enviado
router.post('/verify-otp', 
    validateCodeOTP
);

module.exports = router;