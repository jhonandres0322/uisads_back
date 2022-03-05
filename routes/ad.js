// Invocación de las dependencias
const { Router } = require("express");
const { check } = require('express-validator');

// Invocacion de los controladores
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

// Invocacion de los middlewares
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

router.get('/',
    validateJWT,
    validateFields,
    getAds
);

router.get('/:id',
    validateJWT,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(validateAdExists),
    validateFields,
    getAd
);

router.get('/publisher/:id',
    validateJWT,
    check('id','No es un perfil valido').isMongoId(),
    check('id').custom(validateExistsProfile),
    validateFields,
    getAdsByPublisher
);

router.get('/category/:id',
    validateJWT,
    check('id','No es una categoria valida').isMongoId(),
    check('id').custom(validateCategoryExists),
    validateFields,
    getAdsByPublisher
)

router.post('/',
    validateJWT,
    upload.array('images',5),
    // saveImages,
    check('title', 'El titulo del anuncio es obligatorio').not().isEmpty(),
    check('description','La descripción es obligatoria').not().isEmpty(),
    validateFields,
    createAd
);

router.put('/:id',
    validateJWT,
    validateOwnerAd,
    upload.array('images',5),
    check('id','No es un id valido').isMongoId(),
    check('id').custom(validateAdExists),
    validateFields,
    updateAd
);


router.delete('/:id',
    validateJWT,
    validateOwnerAd,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(validateAdExists),
    validateFields,
    deleteAd
);

router.post('/rating/:id', 
    validateJWT,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(validateAdExists),
    validateFields,
    manageRating
);

router.get('/search/:query',
    validateJWT,
    searchAds
);


module.exports = router;