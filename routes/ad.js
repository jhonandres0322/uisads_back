// Invocación de las dependencias
const { Router } = require("express");
const { check } = require('express-validator');
const multer =  require('multer');

// Invocacion de los controladores
const { createAd, updateAd, deleteAd } = require("../controllers/ad");

// Invocacion de los middlewares
const { validateFields } = require("../middlewares/validate_fields");
const { validateJWT } = require('../middlewares/validate_jwt');
const { validateAdExists } = require('../middlewares/validate_ad');

const router = Router();
const { saveImagesAd } = require('../middlewares/upload');

router.post('/',
    multer({}).array('images',5),
    saveImagesAd,
    validateJWT,
    check('title', 'El titulo del anuncio es obligatorio').not().isEmpty(),
    check('description','La descripción es obligatoria').not().isEmpty(),
    validateFields,
    createAd
);

router.put('/:id',
    validateJWT,
    check('id','No es un id valido').isMongoId(),
    check('title','El tiulo del anuncio es obligatorio').not().isEmpty(),
    check('description','La descripción es obligatoria').not().isEmpty(),
    check('id').custom(validateAdExists),
    validateFields,
    updateAd
);


router.delete('/:id',
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(validateAdExists),
    validateFields,
    deleteAd
);


module.exports = router;