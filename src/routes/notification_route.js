const { Router } = require('express');
const { validateJWT } = require('../middlewares/validate_jwt');
const {  validateFields } = require('../middlewares/validate_fields');
const { 
    manageNotifications, 
    getNotifications,
    validateNotifcations
} = require('../controllers/notification_controller');

const router = Router();

router.post('/',
    validateJWT,
    validateFields,
    manageNotifications
);

router.get('/:page',
    validateJWT,
    validateFields,
    getNotifications
);

router.post('/validate', 
    validateJWT,
    validateFields,
    validateNotifcations
);

module.exports = router;