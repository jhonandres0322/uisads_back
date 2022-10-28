const { Router } = require('express');
const { check } = require('express-validator');

const { 
    getHistorial,
    removeHistorialTotal
} = require('../controllers/historial_controller');

const { validateJWT } = require('../middlewares/validate_jwt');
const { validateFields } = require('../middlewares/validate_fields');

const router = Router();

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