// * Importacion de dependencias
const { Router } = require("express");
const { check } = require('express-validator');

// * Importacion de controladores
const { 
    createAd,
    updateAd,
    deleteAd,
    getAd,
    manageRating,
    getAdsByPublisher,
    getAds,
    searchAds,
    getAdsByCategory
} = require("../controllers/ad_controller");

// * Importacion de middlewares
const { validateFields } = require("../middlewares/validate_fields");
const { validateJWT } = require('../middlewares/validate_jwt');
const { 
    validateAdExists,
    validateOwnerAd,
    validateCategoryExists
} = require('../middlewares/validate_ad');
const { saveImages } = require('../middlewares/upload_middleware');
const { validateExistsProfile } = require("../middlewares/validate_user");

const router = Router();

// * Ruta que lista todos los anuncios
router.get('/ads/:page',
    validateJWT,
    validateFields,
    getAds
);

// * Ruta que lista un unico anuncio con toda su información
router.get('/:id',
    validateJWT,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(validateAdExists),
    validateFields,
    getAd
);

// * Ruta que lista todos los anuncios de un perfil de usuario
router.get('/publisher/:id',
    validateJWT,
    check('id','No es un perfil valido').isMongoId(),
    check('id').custom(validateExistsProfile),
    validateFields,
    getAdsByPublisher
);

// * Ruta que lista todos los anuncios por una categoria
router.get('/category/:id',
    validateJWT,
    check('id','No es una categoria valida').isMongoId(),
    check('id').custom(validateCategoryExists),
    validateFields,
    getAdsByCategory
)

// * Ruta que crea un anuncio
router.post('/',
    validateJWT,
    saveImages,
    check('title', 'El titulo del anuncio es obligatorio').not().isEmpty(),
    check('description','La descripción es obligatoria').not().isEmpty(),
    validateFields,
    createAd
);

// * Ruta que actualiza un anuncio
router.put('/:id',
    validateJWT,
    validateOwnerAd,
    check('id','No es un id valido').isMongoId(),
    check('id').custom(validateAdExists),
    validateFields,
    updateAd
);  

// * Ruta que elimina un anuncio
router.delete('/:id',
    validateJWT,
    validateOwnerAd,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(validateAdExists),
    validateFields,
    deleteAd
);

// * Ruta que gestiona la calificación de un anuncio
router.post('/rating', 
    validateJWT,
    manageRating
);

// * Ruta que busca los anuncios
router.get('/search/:query?',
    validateJWT,
    searchAds
);

module.exports = router;