// Invocación de las dependencias
const { Router } = require("express");
const { check, body } = require('express-validator');
const multer =  require('multer');
const { createProfile, getProfile, updateProfile } = require("../controllers/profile");
const { saveImages, upload } = require("../middlewares/upload");
const { validateFields } = require("../middlewares/validate_fields");
const { validateJWT } = require("../middlewares/validate_jwt");
const { isProfileExists, validateExistsProfile } = require("../middlewares/validate_user");


// Instancia del router
const router = Router();

router.get('/:id',
    validateJWT,
    check('id','No es un id valido').isMongoId(),
    validateFields,
    getProfile
);

router.post('/',
    validateJWT,
    upload.single('image'),
    // saveImages,
    isProfileExists,
    check('name','El nombre es obligatorio').not().isEmpty(),
    check('cellphone', 'El telefono es obligatorio').not().isEmpty(),
    check('cellphone','Debe ser un número de telefono valido').isMobilePhone('es-CO'),
    check('city','La ciudad es obligatoria').not().isEmpty(),
    validateFields,
    createProfile
);

router.put('/:id',
    validateJWT,
    check('id','No es un id valido').isMongoId(),
    upload.single('image'),
    // saveImages,
    check('id').custom(validateExistsProfile),
    check('cellphone','Debe ser un número de telefono valido')
        .if( body('cellphone').exists() )
        .isMobilePhone('es-CO'),
    validateFields,
    updateProfile
);




module.exports = router;