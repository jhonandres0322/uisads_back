// Invocación de las dependencias
const { Router } = require("express");
const { check } = require('express-validator');
const multer =  require('multer');

// Invocacion de los controladores
const { createAd, updateAd, deleteAd, getAd, manageRating } = require("../controllers/ad");

// Invocacion de los middlewares
const { validateFields } = require("../middlewares/validate_fields");
const { validateJWT } = require('../middlewares/validate_jwt');
const { validateAdExists } = require('../middlewares/validate_ad');

const router = Router();
const { saveImages } = require('../middlewares/upload');

router.get('/:id',
    validateJWT,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(validateAdExists),
    validateFields,
    getAd
);

router.post('/',
    validateJWT,
    multer({}).array('images',5),
    saveImages,
    check('title', 'El titulo del anuncio es obligatorio').not().isEmpty(),
    check('description','La descripción es obligatoria').not().isEmpty(),
    validateFields,
    createAd
);

router.put('/:id',
    validateJWT,
    multer({}).array('images',5),
    check('id','No es un id valido').isMongoId(),
    check('id').custom(validateAdExists),
    validateFields,
    updateAd
);


router.delete('/:id',
    validateJWT,
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


module.exports = router;