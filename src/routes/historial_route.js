const { Router } = require('express');
const { check } = require('express-validator');

const { 
    addAdHistorial,
    getHistorial,
    removeHistorialTotal
} = require('../controllers/historial_controller');

const { validateJWT } = require('../middlewares/validate_jwt');
const { validateFields } = require('../middlewares/validate_fields');
const { validateAdExists } = require('../middlewares/validate_ad');

const router = Router();

router.post('/',
    validateJWT,
    check('ad', 'El id del anuncio es obligatorio').not().isEmpty(),
    check('ad').custom( validateAdExists ),
    validateFields,
    addAdHistorial
);

router.get('/:page',
    validateJWT,
    validateFields,
    getHistorial
);

router.delete('/',
    validateJWT,
    validateFields,
    removeHistorialTotal
);

module.exports = router;