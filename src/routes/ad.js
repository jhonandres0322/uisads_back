// * Llamado de dependencias
const { Router } = require("express");
const { check } = require('express-validator');

// * Llamado de controladores
const { 
    createAd,
    updateAd,
    deleteAd,
    getAd,
    manageRating,
    getAdsByPublisher,
    getAds,
    searchAds
} = require("../controllers/ad");

// * Llamado de middlewares
const { validateFields } = require("../middlewares/validate_fields");
const { validateJWT } = require('../middlewares/validate_jwt');
const { 
    validateAdExists,
    validateOwnerAd,
    validateCategoryExists
} = require('../middlewares/validate_ad');
const { saveImages, upload } = require('../middlewares/upload');
const { validateExistsProfile } = require("../middlewares/validate_user");

const router = Router();

// * Ruta que lista todos los anuncios
router.get('/',
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
    getAdsByPublisher
)

// * Ruta que crea un anuncio
router.post('/',
    validateJWT,
    upload.array('images',5),
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
    upload.array('images',5),
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
router.post('/rating/:id', 
    validateJWT,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(validateAdExists),
    validateFields,
    manageRating
);

// * Ruta que busca los anuncios
router.get('/search/:query',
    validateJWT,
    searchAds
);

module.exports = router;