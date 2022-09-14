// * Importación de las dependencias
const { Router } = require("express");
const { check } = require('express-validator');
// * Importación de los controladores
const {
    login,
    registerUser,
    changePassword,
    forgotPassword,
    validateCodeOTP,
    loginGoogleAuth,
    loginFacebookAuth
} = require('../controllers/auth_controller');

// * Importación de los middlewares
const { validateFields } = require("../middlewares/validate_fields");
const { isEmailExists } = require("../middlewares/validate_user");
const { validateJWT } = require('../middlewares/validate_jwt');

const router = Router();

// * Ruta para loguearse en la aplicación
router.post('/login',
    check('email', 'El correo es obligatorio').not().isEmpty(),
    check('email', 'El correo debe ser valido').isEmail(),
    check('password','La contraseña es obligatoria').not().isEmpty(),
    validateFields,
    login 
);

// * Ruta para registrar un nuevo usuario
router.post('/register',
    check('email', 'El correo es obligatorio').not().isEmpty(),
    check('email', 'El correo debe ser valido').isEmail(), 
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('cellphone', 'El telefono es obligatorio').not().isEmpty(),
    check('cellphone','Debe ser un número de telefono valido').isMobilePhone('es-CO'),
    check('city','La ciudad debe ser obligatoria').not().isEmpty(),
    check('city','No es una ciudad valida').isMongoId(),
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
    check('email', 'El correo es obligatorio').not().isEmpty(),
    check('email','El correo debe ser valido').isEmail(),
    validateFields,
    forgotPassword
);

// * Ruta para verificar el otp enviado
router.post('/verify-otp', 
    validateCodeOTP
);
// *Ruta para verificar el usuario que loguea
router.post('/google',  
    loginGoogleAuth
);

// *Ruta para verificar el usuario que loguea
router.post('/facebook/token',
    loginFacebookAuth
);

module.exports = router;