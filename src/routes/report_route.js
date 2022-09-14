const { Router } = require('express');
const { check } = require('express-validator');

const {
    manageReport
} = require('../controllers/report_controller');

const { validateJWT } = require('../middlewares/validate_jwt');
const { validateFields } = require("../middlewares/validate_fields");
const { isProfileExists } = require("../middlewares/validate_user");

const router = Router();

router.post('/manage',
    validateJWT,
    isProfileExists,
    check('ad','La publicación debe ser obligatoria').not().isEmpty(),
    check('ad').isMongoId(),
    validateFields,
    manageReport
);

module.exports = router;