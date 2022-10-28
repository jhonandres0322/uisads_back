const { Router } = require('express');
const { check } = require('express-validator');

const router = Router();


const { createInterest,  getInterests, removeInterests } = require('../controllers/interest_controller');
const { validateFields } = require('../middlewares/validate_fields');
const { validateJWT } = require('../middlewares/validate_jwt');

router.post('/', 
    validateJWT,
    check('interests', 'Los intereses son obligatorios').not().isEmpty(),
    validateFields,
    createInterest
);
router.get('/', 
    validateJWT,
    getInterests
);
router.delete('/', 
    validateJWT,
    removeInterests
);

module.exports = router;