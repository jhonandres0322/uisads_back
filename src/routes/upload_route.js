// * Llamado de las dependencias
const { Router } = require('express');
const { check } = require('express-validator');

// * Llamado de los middlewares
const { validateFields } = require('../middlewares/validate_fields');
const { validateJWT } = require('../middlewares/validate_jwt');
const { isProfileExists } = require('../middlewares/validate_user');

//* Llamado de los controladores
const { deleteUpload } = require('../controllers/upload_controller');

const router = Router();

router.delete('/:id',
    validateJWT,
    check('id','No es un id valido').isMongoId(),
    validateFields,
    deleteUpload
);


module.exports = router;