const { Router } = require('express');
const { check } = require('express-validator');

const {
    manageReport
} = require('../controllers/report_controller');

const { validateJWT } = require('../middlewares/validate_jwt');
const { validateFields } = require("../middlewares/validate_fields");
const { validateAdExists } = require('../middlewares/validate_ad');


const router = Router();

router.post('/',
    validateJWT,
    check('ad').custom( validateAdExists ),
    check('ad','La publicación debe ser obligatoria').not().isEmpty(),
    check('ad').isMongoId(),
    validateFields,
    manageReport
);

module.exports = router;