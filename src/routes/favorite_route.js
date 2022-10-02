const { Router } = require('express');
const { check } = require('express-validator');

const { validateJWT } = require('../middlewares/validate_jwt');
const { validateFields } = require('../middlewares/validate_fields');
const { validateAdExists } = require('../middlewares/validate_ad');

const { 
    saveAdFavorite, 
    getFavorites, 
    deleteFavorite 
} = require('../controllers/favorite_controller');

const router = Router();


router.post('/favorite-ad',
    validateJWT,
    check('ad','No es un id valido').isMongoId(),
    check('ad').custom(validateAdExists),
    validateFields,
    saveAdFavorite
);

router.get('/favorite-ad/:page',
    validateJWT,
    validateFields,
    getFavorites
);

router.delete('/favorite-ad/:ad',
    validateJWT,
    check('ad','No es un id valido').isMongoId(),
    check('ad').custom(validateAdExists),
    validateFields,
    deleteFavorite
);

module.exports = router;