// * Llamado de las dependencias
const { Router } = require("express");
const { check, body } = require('express-validator');

// * Llamado de los controladores
const { 
    getProfile, 
    updateProfile, 
    calculateRatingProfile,
    saveAdFavorite,
    getFavorites,
    deleteFavorite
} = require("../controllers/profile_controller");

// * Llamado de los middlewares
const { saveImageProfile } = require("../middlewares/upload_middleware");
const { validateFields } = require("../middlewares/validate_fields");
const { validateJWT } = require("../middlewares/validate_jwt");
const { validateExistsProfile } = require("../middlewares/validate_user");
const { validateAdExists } =  require('../middlewares/validate_ad');


const router = Router();

// * Ruta para mostrar el perfil de un usuario
router.get('/:id',
    validateJWT,
    check('id','No es un id valido').isMongoId(),
    validateFields,
    getProfile
);

// * Ruta para actualizar un perfil
router.put('/:id',
    validateJWT,
    check('id','No es un id valido').isMongoId(),
    saveImageProfile,
    check('id').custom(validateExistsProfile),
    check('cellphone','Debe ser un número de telefono valido')
        .if( body('cellphone').exists() )
        .isMobilePhone('es-CO'),
    validateFields,
    updateProfile
);

// * Ruta para calcular la calificación del perfil
router.post('/calculate',
    validateJWT,
    calculateRatingProfile
);

router.post('/favorite-ad',
    validateJWT,
    check('id','No es un id valido').isMongoId(),
    check('id').custom(validateAdExists),
    validateFields,
    saveAdFavorite
);

router.get('/favorite-ad/:page',
    validateJWT,
    validateFields,
    getFavorites
);

router.delete('/favorite-ad/:id',
    validateJWT,
    check('id','No es un id valido').isMongoId(),
    check('id').custom(validateAdExists),
    validateFields,
    deleteFavorite
);


module.exports = router;