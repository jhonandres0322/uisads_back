// Invocación de las dependencias
const { Router } = require("express");
const { check } = require('express-validator');
const multer =  require('multer');
const { createProfile } = require("../controllers/profile");
const { saveImages } = require("../middlewares/upload");
const { validateFields } = require("../middlewares/validate_fields");
const { validateJWT } = require("../middlewares/validate_jwt");
const { isUserExists, isProfileExists } = require("../middlewares/validate_user");




// Instancia del router
const router = Router();

// Rutas
router.post('/',
    validateJWT,
    multer({}).single('image'),
    saveImages,
    isProfileExists,
    check('name','El nombre es obligatorio').not().isEmpty(),
    check('cellphone', 'El telefono es obligatorio').not().isEmpty(),
    check('cellphone','Debe ser un número de telefono valido').isMobilePhone('es-CO'),
    check('city','La ciudad es obligatoria').not().isEmpty(),
    validateFields,
    createProfile
);




module.exports = router;